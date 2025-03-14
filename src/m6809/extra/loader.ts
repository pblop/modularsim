import type { IModule, ModuleDeclaration } from "../../types/module.js";
import type { EventDeclaration, TypedEventTransceiver } from "../../types/event.js";

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
      const lines = text.split("\n");
      for (const line of lines) {
        const recordType = line.slice(0, 2);
        // const byteCount = Number.parseInt(line.slice(2, 4), 16);
        const address = Number.parseInt(line.slice(4, 8), 16);
        const data = line.slice(8, line.length - 2);
        // const checksum = Number.parseInt(line.slice(line.length - 2), 16);
        if (recordType === "S1") {
          const bytes = hexStringToBytes(data);
          console.log(`[${this.id}] Writing ${bytes.length} bytes to address ${address}`);
          this.evt.emit("ui:memory:bulk:write", address, bytes);
        }
      }
    }
  };
}

export default Loader;
