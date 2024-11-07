import { IModule } from "../general/module.js";
import { ISimulator, SimulatorBase } from "../general/simulator.js";
import { EventDeclaration } from "../types/event.js";
import { checkProperties } from "../utils.js";

type MemoryType = "ram" | "rom";
type MemoryConfig = {
  start: number;
  size: number;
  type: MemoryType;
};

class Memory implements IModule {
  simulator: ISimulator;

  memory: Uint8Array;
  start: number;
  type: MemoryType;

  getEventDeclaration(): EventDeclaration {
    return {
      provided: ["memory:read", "memory:write"],
      required: [],
      optional: [],
    };
  }

  constructor(config: any | undefined, simulator: ISimulator) {
    console.log("[Memory] Initializing module.");

    this.simulator = simulator;

    // Verify that configuration is ok.
    if (!config) throw new Error(`[Memory] No configuration provided`);

    config = this.verify_config(config);

    const { size, start, type } = config;
    this.memory = new Uint8Array(size);
    this.start = start;
    this.type = type;

    this.add_listeners();
    console.log(`[Memory] Initialized ${type} memory at ${start} with size ${size}`);
  }

  add_listeners(): void {
    this.simulator.on("memory:read", this.on_memory_read);
    this.simulator.on("memory:write", this.on_memory_write);
  }
  on_memory_read = (address: number): void => {
    // If the address is out of bounds, do nothing.
    if (address < this.start || address >= this.start + this.memory.length) return;

    const data = this.memory[address - this.start];
    // TODO: Add delays here.
    this.simulator.emit("memory:read:result", address, data);
  };
  on_memory_write = (address: number, data: number): void => {
    // If the address is out of bounds, do nothing.
    if (address < this.start || address >= this.start + this.memory.length) return;

    // TODO: Add delays here.
    this.memory[address - this.start] = data;
  };

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
