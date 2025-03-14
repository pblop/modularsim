import type { IModule, ModuleDeclaration } from "../../types/module.js";
import type { EventDeclaration, TypedEventTransceiver } from "../../types/event.js";
import { truncate } from "../../general/numbers.js";
import { verify } from "../../general/config.js";

type LoaderConfig = {
  file: string;
  symbolsFile?: string;
};

function validateLoaderConfig(config: Record<string, unknown>): LoaderConfig {
  if (typeof config.file !== "string") throw new Error("[Loader] binUrl must be a string");
  return config as LoaderConfig;
}

function hexStringToBytes(hexString = ""): Uint8Array {
  const numbytes = Math.floor(hexString.length / 2);
  const bytes = new Uint8Array(numbytes);

  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Number.parseInt(hexString.slice(i * 2, i * 2 + 2), 16);
  }

  return bytes;
}

function calculateSRECChecksum(...byteArrs: Uint8Array[]): number {
  // the least significant byte of ones' complement of the sum of the values
  // represented by the two hex digit pairs for the Byte Count, Address and Data fields
  let checksum = 0;
  for (const arr of byteArrs) {
    for (let i = 0; i < arr.length; i++) checksum = (checksum + arr[i]) & 0xffff;
  }
  return 0xff - (checksum & 0xff);
}

class Loader implements IModule {
  evt: TypedEventTransceiver;
  id: string;
  config: LoaderConfig;

  fileType: "bin" | "s19";
  symbolsType: "noice" | undefined;

  getModuleDeclaration(): ModuleDeclaration {
    return {
      events: {
        provided: ["ui:memory:write", "ui:memory:bulk:write", "dbg:symbol:add"],
        required: {
          "system:load_finish": this.onLoadFinish,
        },
        optional: {},
      },
    };
  }

  constructor(
    id: string,
    config: Record<string, unknown> | undefined,
    eventTransceiver: TypedEventTransceiver,
  ) {
    this.evt = eventTransceiver;
    this.id = id;

    console.log(`[${this.id}] Initializing module.`);

    // Verify that configuration is ok.
    this.config = verify(
      config,
      {
        file: {
          type: "string",
          required: true,
        },
        symbolsFile: {
          type: "string",
          required: false,
        },
      },
      `[${this.id}] configuration error: `,
    );

    if (this.config.file.endsWith(".bin")) {
      this.fileType = "bin";
    } else if (this.config.file.endsWith(".s19")) {
      this.fileType = "s19";
    } else {
      throw new Error(`[${this.id}] Invalid file extension. Must be .bin or .s19`);
    }

    if (this.config.symbolsFile !== undefined) {
      if (this.config.symbolsFile.endsWith(".noi")) {
        this.symbolsType = "noice";
      } else {
        throw new Error(`[${this.id}] Invalid symbols file extension. Must be .noi`);
      }
    }

    console.log(`[${this.id}] Initialized with config:`, this.config);
  }

  loadFile = async (file: string, fileType: "s19" | "bin"): Promise<void> => {
    const r = await fetch(file);
    if (fileType === "bin") {
      const buffer = await r.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      this.evt.emit("ui:memory:bulk:write", 0, bytes);
    } else if (fileType === "s19") {
      const text = await r.text();
      const lines = text.trim().split("\n");
      for (const line of lines) {
        // .s19 files have 16-bit addresses (s0, s1, s5, s9 records)
        const recordType = line.slice(0, 2);
        const byteCountStr = line.slice(2, 4);
        const addressStr = line.slice(4, 8);
        const dataStr = line.slice(8, line.length - 2);

        const byteCount = Number.parseInt(byteCountStr, 16);
        const address = Number.parseInt(addressStr, 16);
        const checksum = Number.parseInt(line.slice(line.length - 2), 16);

        // Check the byte count.
        // The byte count is the number of bytes in the rest of the record
        if (byteCount < 3) {
          console.error(
            `[${this.id}] Invalid record length: byte count is ${byteCount}, and it cannot be less than 3`,
          );
          continue;
        }
        if (byteCount * 2 !== line.length - 4) {
          console.error(
            `[${this.id}] Invalid record length: count is ${byteCount}, but the record has ${(line.length - 4) / 2} bytes`,
          );
          continue;
        }

        const data = hexStringToBytes(dataStr);

        // Check the checksum.
        const calculatedChecksum = calculateSRECChecksum(
          hexStringToBytes(byteCountStr),
          hexStringToBytes(addressStr),
          data,
        );
        if (calculatedChecksum !== checksum) {
          console.error(
            `[${this.id}] Invalid checksum: expected ${checksum}, but got ${calculatedChecksum}`,
          );
          continue;
        }

        // Write the data to memory.
        if (recordType === "S1") {
          this.evt.emit("ui:memory:bulk:write", address, data);
        }
      }
    }
  };

  loadSymbols = async (file: string, fileType: "noice"): Promise<void> => {
    const r = await fetch(file);
    const text = await r.text();
    if (fileType === "noice") {
      /* NOICE symbols contain the following types of lines:
       * (https://github.com/pblop/asxxxx/blob/bb548e30b92d9e2a918acf92596bf0b3c614632f/asxv5pxx/linksrc/lknoice.c)
       * -    global symbols: DEF <symbol> <address>
       * -    scoped symbols: DEFS <symbol> <address>
       * -             files: FILE <filename> <address>
       *             (or just FILE <filename>, if no address present)
       * -         functions: DEF <symbol> <address> & FUNC <symbol> <address>
       *             (or just FUNC <symbol>, if no address present)
       * -  static functions: DEFS <symbol> <address> & SFUNC <symbol> <address>
       *             (or just SFUNC <symbol>, if no address present)
       * -     end functions: ENDF <symbol> <address>
       * -             lines: LINE <line> <address>
       *
       * But, so far, only the DEFs are relevant to us.
       */
      const lines = text.trim().split("\n");
      for (const line of lines) {
        const words = line.trim().split(" ");
        switch (words[0]) {
          case "DEF": {
            const symbol = words[1];
            const address = Number.parseInt(words[2], 16);
            this.evt.emit("dbg:symbol:add", symbol, address, "global");
            break;
          }
        }
      }
    }
  };

  onLoadFinish = () => {
    const promises = [this.loadFile(this.config.file, this.fileType)];
    if (this.config.symbolsFile !== undefined) {
      promises.push(this.loadSymbols(this.config.symbolsFile, this.symbolsType!));
    }
    return Promise.all(promises);
  };
}

export default Loader;
