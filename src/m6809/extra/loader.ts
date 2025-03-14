import type { IModule, ModuleDeclaration } from "../../types/module.js";
import type { EventDeclaration, TypedEventTransceiver } from "../../types/event.js";
import { truncate } from "../../general/numbers.js";

type LoaderConfig = {
  file: string;
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

  getModuleDeclaration(): ModuleDeclaration {
    return {
      events: {
        provided: ["ui:memory:write", "ui:memory:bulk:write"],
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
    if (!config) throw new Error(`[${this.id}] No configuration provided`);
    this.config = validateLoaderConfig(config);

    if (this.config.file.endsWith(".bin")) {
      this.fileType = "bin";
    } else if (this.config.file.endsWith(".s19")) {
      this.fileType = "s19";
    } else {
      throw new Error(`[${this.id}] Invalid file extension. Must be .bin or .s19`);
    }

    console.log(`[${this.id}] Initialized with config:`, this.config);
  }

  onLoadFinish = async (): Promise<void> => {
    const r = await fetch(this.config.file);
    if (this.fileType === "bin") {
      const buffer = await r.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      this.evt.emit("ui:memory:bulk:write", 0, bytes);
    } else if (this.fileType === "s19") {
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
}

export default Loader;
