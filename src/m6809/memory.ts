import type { IModule } from "../types/module.js";
import type { ISimulator } from "../types/simulator.js";
import type { EventDeclaration, TypedEventTransceiver } from "../types/event.js";

type MemoryType = "ram" | "rom";
type MemoryConfig = {
  start: number;
  size: number;
  type: MemoryType;
  read_delay?: number;
  write_delay?: number;
};

function validate_memory_config(config: Record<string, unknown>): MemoryConfig {
  // Check that the properties have the correct types.
  if (typeof config.start !== "number") throw new Error("[Memory] start must be a number");
  if (typeof config.size !== "number") throw new Error("[Memory] size must be a number");
  if (typeof config.type !== "string" || !["ram", "rom"].includes(config.type))
    throw new Error(`[Memory] type must be 'ram' or 'rom'`);
  if (config.read_delay && typeof config.read_delay !== "number")
    throw new Error("[Memory] read_delay must be a number");
  if (config.write_delay && typeof config.write_delay !== "number")
    throw new Error("[Memory] write_delay must be a number");

  // Now that we know that the properties are there, we can safely cast the config.
  return config as MemoryConfig;
}

class Memory implements IModule {
  event_transceiver: TypedEventTransceiver;
  id: string;

  memory: Uint8Array;
  start: number;
  type: MemoryType;
  read_delay: number;
  write_delay: number;

  getEventDeclaration(): EventDeclaration {
    return {
      provided: ["memory:read:result", "memory:write:result"],
      required: [],
      optional: ["memory:read", "memory:write"],
    };
  }

  constructor(id: string, config: Record<string, unknown> | undefined, simulator: ISimulator) {
    // We use the simulator to emit/receive events.
    this.event_transceiver = simulator;
    this.id = id;

    console.log(`[${this.id}] Initializing module.`);

    // Verify that configuration is ok.
    if (!config) throw new Error(`[${this.id}] No configuration provided`);

    const parsed_config = validate_memory_config(config);
    const { size, start, type } = parsed_config;

    this.memory = new Uint8Array(size);
    this.start = start;
    this.type = type;
    this.read_delay = parsed_config.read_delay ?? 95;
    this.write_delay = parsed_config.write_delay ?? 95;

    this.addListeners();
    console.log(`[${this.id}] Initialized ${type} memory at ${start} with size ${size}`);
  }

  addListeners(): void {
    this.event_transceiver.on("memory:read", this.on_memory_read);
    this.event_transceiver.on("memory:write", this.on_memory_write);
  }
  on_memory_read = (address: number): void => {
    // If the address is out of bounds, do nothing.
    if (address < this.start || address >= this.start + this.memory.length) return;

    const data = this.memory[address - this.start];
    // TODO: Add delays here.
    this.event_transceiver.emit("memory:read:result", address, data);
  };
  on_memory_write = (address: number, data: number): void => {
    // If the address is out of bounds, do nothing.
    if (address < this.start || address >= this.start + this.memory.length) return;

    this.memory[address - this.start] = data;

    // TODO: Add delays here.
    this.event_transceiver.emit("memory:write:result", address, data);
  };
}

export default Memory;
