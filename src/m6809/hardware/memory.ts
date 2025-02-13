import type {
  IModule,
  ModuleDeclaration,
  SimulationModuleInteraction,
} from "../../types/module.js";
import type { ISimulator } from "../../types/simulator.js";
import type { EventContext, EventDeclaration, TypedEventTransceiver } from "../../types/event.js";

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
  simulation: SimulationModuleInteraction;
  id: string;

  memory: Uint8Array;
  start: number;
  type: MemoryType;
  read_delay: number;
  write_delay: number;

  getModuleDeclaration(): ModuleDeclaration {
    return {
      events: {
        provided: [
          "memory:read:result",
          "memory:write:result",
          "ui:memory:read:result",
          "ui:memory:write:result",
          "ui:memory:bulk:write:result",
        ],
        required: {},
        optional: {
          "memory:read": this.onMemoryRead,
          "memory:write": this.onMemoryWrite,
          "ui:memory:read": this.onUiMemoryRead,
          "ui:memory:write": this.onUiMemoryWrite,
          "ui:memory:bulk:write": this.onUiMemoryBulkWrite,
        },
      },
    };
  }

  constructor(
    id: string,
    config: Record<string, unknown> | undefined,
    simulation: SimulationModuleInteraction,
  ) {
    // We use the simulator to emit/receive events.
    this.simulation = simulation;
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

    console.log(`[${this.id}] Initialized ${type} memory at ${start} with size ${size}`);
  }

  onUiMemoryRead = (address: number, ctx: EventContext): void => {
    // If the address is out of bounds, do nothing.
    if (address < this.start || address >= this.start + this.memory.length) return;

    const data = this.memory[address - this.start];
    this.simulation.emit("ui:memory:read:result", address, data);
  };
  onUiMemoryWrite = (address: number, data: number, ctx: EventContext): void => {
    // If the address is out of bounds, do nothing.
    if (address < this.start || address >= this.start + this.memory.length) return;

    this.memory[address - this.start] = data;
    this.simulation.emit("ui:memory:write:result", address, data);
  };
  onUiMemoryBulkWrite = (data: Uint8Array): void => {
    if (data.length > this.memory.length) {
      throw new Error(`[${this.id}] Attempted to write more data than memory size.`);
    }

    this.memory.set(data);
    this.simulation.emit("ui:memory:bulk:write:result", data);
  };
  onMemoryRead = (address: number) => {
    // If the address is out of bounds, do nothing.
    if (address < this.start || address >= this.start + this.memory.length) return;

    const data = this.memory[address - this.start];
    this.simulation.onceCycle(
      () => {
        this.simulation.emit("memory:read:result", address, data);
      },
      { order: -1 },
    );
  };
  onMemoryWrite = (address: number, data: number) => {
    // If the address is out of bounds, do nothing.
    if (address < this.start || address >= this.start + this.memory.length) return;

    this.memory[address - this.start] = data;

    this.simulation.onceCycle(
      () => {
        this.simulation.emit("memory:write:result", address, data);
      },
      { order: -1 },
    );
  };
}

export default Memory;
