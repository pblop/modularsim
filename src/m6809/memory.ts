import { IModule } from "../general/module.js";
import { checkProperties } from "../utils.js";

type MemoryType = "ram" | "rom";
type MemoryConfig = {
  start: number;
  size: number;
  type: MemoryType;
};

class Memory implements IModule {
  memory: Uint8Array;
  start: number;
  type: MemoryType;

  constructor(config?: any) {
    console.log("[Memory] Initializing module.");
    // Verify that configuration is ok.
    if (!config) throw new Error(`[Memory] No configuration provided`);

    config = this.verify_config(config);

    const { size, start, type } = config;
    this.memory = new Uint8Array(size);
    this.start = start;
    this.type = type;

    console.log(`[Memory] Initialized ${type} memory at ${start} with size ${size}`);
  }

  verify_config(config: any): MemoryConfig {
    // Check that the config has the required fields.
    checkProperties(config, ["start", "size", "type"]);

    // Check that the properties have the correct types.
    if (typeof config.start !== "number") throw new Error(`[Memory] start must be a number`);
    if (typeof config.size !== "number") throw new Error(`[Memory] size must be a number`);
    if (!["ram", "rom"].includes(config.type))
      throw new Error(`[Memory] type must be 'ram' or 'rom'`);

    // Now that we know that the properties are there, we can safely cast the config.
    return config as MemoryConfig;
  }
}

export default Memory;
