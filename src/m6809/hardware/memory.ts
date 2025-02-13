import type {
  IModule,
  ModuleDeclaration,
  SimulationModuleInteraction,
} from "../../types/module.js";
import type { ISimulator } from "../../types/simulator.js";
import type {
  EventBaseName,
  EventCallback,
  EventContext,
  EventDeclaration,
  EventDeclarationListeners,
  EventName,
  EventParams,
  TypedEventTransceiver,
} from "../../types/event.js";
import { verify } from "../../general/config.js";
import { joinEventName } from "../../general/event.js";

type MemoryType = "ram" | "rom";
type MemoryConfig = {
  size: number;
  type: MemoryType;
  multiplexer?: string;
};

class Memory implements IModule {
  simulation: SimulationModuleInteraction;
  id: string;

  config: MemoryConfig;

  memory: Uint8Array;

  getModuleDeclaration(): ModuleDeclaration {
    const multiplexedName = (event: EventBaseName) =>
      this.config.multiplexer ? joinEventName(event, this.id) : event;
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
          [multiplexedName("memory:read")]: this.onMemoryRead,
          [multiplexedName("memory:write")]: this.onMemoryWrite,
          [multiplexedName("ui:memory:read")]: this.onUiMemoryRead,
          [multiplexedName("ui:memory:write")]: this.onUiMemoryWrite,
          [multiplexedName("ui:memory:bulk:write")]: this.onUiMemoryBulkWrite,
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
    this.config = verify<MemoryConfig>(
      config,
      {
        size: { type: "number", required: true },
        type: { type: "string", required: true, enum: ["ram", "rom"] },
        multiplexer: { type: "string", required: false },
      },
      this.id,
    );

    this.memory = new Uint8Array(this.config.size);

    console.log(`[${this.id}] Initialized ${this.config.type} memory of size ${this.config.size}`);
  }

  emitMultiplexed<B extends EventBaseName>(event: B, ...args: EventParams<B>): void {
    if (this.config.multiplexer) {
      this.simulation.emit(joinEventName(event, this.config.multiplexer), ...args);
    } else {
      this.simulation.emit(event, ...args);
    }
  }
  onUiMemoryRead = (address: number, ctx: EventContext): void => {
    const data = this.memory[address];
    this.simulation.emit("ui:memory:read:result", address, data);
  };
  onUiMemoryWrite = (address: number, data: number, ctx: EventContext): void => {
    this.memory[address] = data;
    this.simulation.emit("ui:memory:write:result", address, data);
  };
  onUiMemoryBulkWrite = (address: number, data: Uint8Array): void => {
    if (data.length > this.memory.length) {
      throw new Error(`[${this.id}] Attempted to write more data than memory size.`);
    }

    this.memory.set(data);
    this.simulation.emit("ui:memory:bulk:write:result", address, data);
  };
  onMemoryRead = (address: number) => {
    const data = this.memory[address];
    this.simulation.onceCycle(
      () => {
        this.emitMultiplexed("memory:read:result", address, data);
      },
      { order: -1 },
    );
  };
  onMemoryWrite = (address: number, data: number) => {
    this.memory[address] = data;

    this.simulation.onceCycle(
      () => {
        this.emitMultiplexed("memory:write:result", address, data);
      },
      { order: -1 },
    );
  };
}

export default Memory;
