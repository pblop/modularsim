import { verify } from "../../../utils/config.js";
import { element, iconButton } from "../../../utils/html.js";
import { truncate } from "../../../utils/numbers.js";
import type { EventDeclaration, TypedEventTransceiver } from "../../../types/event.js";
import type { IModule, ModuleDeclaration } from "../../../types/module.js";
import { createLanguageStrings } from "../../../utils/lang.js";

type LoaderConfig = {
  file: string;
  symbolsFile?: string;
  reloadOnPowerOn: boolean;
  reloadOnFileChange: "no" | "reset" | "fast_reset";
  symbolIgnoreRegex?: string;
  symbolIgnoreList: string[];
};

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

const LoaderStrings = createLanguageStrings({
  en: {
    loadMachineCodeFile: "Load machine code file",
    loadSymbolsFile: "Load symbols file",
  },
  es: {
    loadMachineCodeFile: "Cargar archivo de código",
    loadSymbolsFile: "Cargar archivo de símbolos",
  },
});

class Loader implements IModule {
  evt: TypedEventTransceiver;
  id: string;
  config: LoaderConfig;

  fileType: "bin" | "s19";
  symbolsType: "noice" | undefined;
  symbolIgnoreRegex: RegExp | undefined;

  language!: string;
  localeStrings = LoaderStrings.en;

  getModuleDeclaration(): ModuleDeclaration {
    return {
      events: {
        provided: [
          "signal:reset",
          "ui:clock:fast_reset",
          "ui:memory:write",
          "ui:memory:clear",
          "ui:memory:bulk:write",
          "dbg:symbol:add",
          "dbg:symbol:clear",
          "dbg:program:loaded",
        ],
        required: {
          "gui:panel_created": this.onPanelCreated,
          "system:load_finish": this.onLoadFinish,
        },
        optional: {
          "dbg:program:reload": this.onProgramReload,
          "dbg:program:load": this.onProgramLoad,
          "dbg:symbols:load": this.onSymbolsLoad,
        },
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
        reloadOnPowerOn: {
          type: "boolean",
          required: false,
          default: false,
        },
        reloadOnFileChange: {
          type: "string",
          required: false,
          default: "fast_reset",
          enum: ["reset", "fast_reset", "no"],
        },
        symbolIgnoreRegex: {
          type: "string",
          required: false,
        },
        symbolIgnoreList: {
          type: "array",
          required: false,
          schema: {
            type: "string",
          },
          default: [],
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

    if (this.config.symbolIgnoreRegex !== undefined) {
      this.symbolIgnoreRegex = new RegExp(this.config.symbolIgnoreRegex);
    }

    console.log(`[${this.id}] Initialized with config:`, this.config);
  }

  setLanguage = (language: string): void => {
    this.language = language;
    this.localeStrings = LoaderStrings[this.language] || LoaderStrings.en;
  };

  onPanelCreated = (id: string, panel: HTMLElement, language: string) => {
    if (id !== this.id) return;

    this.setLanguage(language);

    panel.classList.add("loader");
    panel.appendChild(
      element(
        "label",
        {
          htmlFor: `${this.id}-file`,
        },
        iconButton("file-up", this.localeStrings.loadMachineCodeFile, () => {
          const input = document.getElementById(`${this.id}-file`) as HTMLInputElement;
          input.click();
        }),
        element("span", {
          innerText: this.localeStrings.loadMachineCodeFile,
        }),
      ),
    );
    panel.appendChild(
      element("input", {
        id: `${this.id}-file`,
        type: "file",
        accept: ".s19,.bin",
        onchange: (e: Event) => {
          const target = e.target as HTMLInputElement;
          if (target.files === null) return;
          const file = target.files[0];
          const url = URL.createObjectURL(file);
          this.loadFile(url, file.name.endsWith(".bin") ? "bin" : "s19");
          this.userChangedFile();
        },
      }),
    );
    panel.appendChild(
      element(
        "label",
        {
          htmlFor: `${this.id}-symbols`,
        },
        iconButton("file-up", this.localeStrings.loadSymbolsFile, () => {
          const input = document.getElementById(`${this.id}-symbols`) as HTMLInputElement;
          input.click();
        }),
        element("span", {
          innerText: this.localeStrings.loadSymbolsFile,
        }),
      ),
    );
    panel.appendChild(
      element("input", {
        id: `${this.id}-symbols`,
        type: "file",
        accept: ".noi",
        onchange: (e: Event) => {
          const target = e.target as HTMLInputElement;
          if (target.files === null) return;
          const file = target.files[0];
          const url = URL.createObjectURL(file);
          this.loadSymbols(url, "noice");
          this.userChangedFile();
        },
      }),
    );
  };

  userChangedFile = () => {
    if (
      this.config.reloadOnFileChange === "reset" ||
      this.config.reloadOnFileChange === "fast_reset"
    )
      // emit a reset signal always
      this.evt.emit("signal:reset");

    // tell the clock to reset fast
    if (this.config.reloadOnFileChange === "fast_reset") this.evt.emit("ui:clock:fast_reset");
  };

  loadBinFile = (filename: string, bytes: Uint8Array): void => {
    this.evt.emit("ui:memory:clear");
    this.evt.emit("ui:memory:bulk:write", 0, bytes);
    this.evt.emit("dbg:program:loaded", filename);
  };
  loadS19File = (filename: string, text: string): void => {
    this.evt.emit("ui:memory:clear");
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

    this.evt.emit("dbg:program:loaded", filename);
  };

  loadFile = async (file: string, fileType: "s19" | "bin"): Promise<void> => {
    const r = await fetch(file);
    const filename = file.split(/(\\|\/)/g).pop()!;

    if (fileType === "bin") {
      this.loadBinFile(filename, new Uint8Array(await r.arrayBuffer()));
    } else if (fileType === "s19") {
      const text = await r.text();
      this.loadS19File(filename, text);
    } else {
      throw new Error(`[${this.id}] Invalid file type: ${fileType}. Must be 's19' or 'bin'.`);
    }
  };

  loadNoiceSymbols = (text: string): void => {
    this.evt.emit("dbg:symbol:clear");
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
          this.conditionalEmitAddSymbol(symbol, address, "global");
          break;
        }
      }
    }
  };

  loadSymbols = async (file: string, fileType: "noice"): Promise<void> => {
    const r = await fetch(file);
    const text = await r.text();
    if (fileType === "noice") {
      this.loadNoiceSymbols(text);
    } else {
      throw new Error(`[${this.id}] Invalid symbols file type: ${fileType}. Must be 'noice'.`);
    }
  };

  loadAll = () => {
    console.log(`[${this.id}] Loading program and symbols...`);
    const promises = [this.loadFile(this.config.file, this.fileType)];
    if (this.config.symbolsFile !== undefined) {
      promises.push(this.loadSymbols(this.config.symbolsFile, this.symbolsType!));
    }
    return Promise.all(promises);
  };
  onProgramReload = () => {
    return this.loadAll();
  };
  onLoadFinish = () => {
    if (!this.config.reloadOnPowerOn) return;
    return this.loadAll();
  };

  onProgramLoad = (type: string, data: Uint8Array | string) => {
    if (type === "bin" && typeof data === "object") {
      this.loadBinFile("ensamblador.bin", data);
    } else if (type === "s19" && typeof data === "string") {
      this.loadS19File("ensamblador.s19", data);
    } else {
      throw new Error(
        `[${this.id}] Invalid program load type or argument value: ${type}. Must be 'bin' or 's19', and data must be Uint8Array or string respectively (got ${typeof data}).`,
      );
    }

    this.userChangedFile();
  };
  onSymbolsLoad = (type: string, data: Uint8Array | string) => {
    if (type === "noice" && typeof data === "string") {
      this.loadNoiceSymbols(data);
    } else {
      throw new Error(
        `[${this.id}] Invalid symbols load type or argument value: ${type}. Must be 'noice', and data must be a string (got ${typeof data}).`,
      );
    }
  };

  /**
   * Emit an event to add a symbol, if it both:
   * - is not in the ignore list
   * - does not match the ignore regex
   */
  conditionalEmitAddSymbol = (symbol: string, address: number, type: "global") => {
    if (this.config.symbolIgnoreList.includes(symbol)) return;
    if (this.symbolIgnoreRegex?.test(symbol)) return;

    this.evt.emit("dbg:symbol:add", symbol, address, type);
  };
}

export default Loader;
