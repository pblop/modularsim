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
    const eventAsMultiplexedInput = (event: EventBaseName) =>
      this.config.multiplexer ? joinEventName(event, this.id) : event;
    const eventAsMultiplexedOutput = (event: EventBaseName): EventName =>
      this.config.multiplexer ? joinEventName(event, this.config.multiplexer) : event;
    return {
      events: {
        provided: [
          eventAsMultiplexedOutput("memory:read:result"),
          eventAsMultiplexedOutput("memory:write:result"),
          eventAsMultiplexedOutput("ui:memory:read:result"),
          eventAsMultiplexedOutput("ui:memory:write:result"),
          eventAsMultiplexedOutput("ui:memory:bulk:write:result"),
        ],
        required: {},
        optional: {
          [eventAsMultiplexedInput("memory:read")]: this.onMemoryRead,
          [eventAsMultiplexedInput("memory:write")]: this.onMemoryWrite,
          [eventAsMultiplexedInput("ui:memory:read")]: this.onUiMemoryRead,
          [eventAsMultiplexedInput("ui:memory:write")]: this.onUiMemoryWrite,
          [eventAsMultiplexedInput("ui:memory:bulk:write")]: this.onUiMemoryBulkWrite,
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

  emitTimed = (event: EventBaseName, ...args: EventParams<EventBaseName>): void => {
    // Memory only responds on its specified time to hardware events.
    this.simulation.onceCycle(() => this.emitMultiplexed(event, ...args), {
      offset: 0,
      subcycle: 100,
    });
  };
  emitMultiplexed<B extends EventBaseName>(event: B, ...args: EventParams<B>): void {
    if (this.config.multiplexer) {
      this.simulation.emit(joinEventName(event, this.config.multiplexer), ...args);
    } else {
      this.simulation.emit(event, ...args);
    }
  }

  onUiMemoryRead = (address: number, ctx: EventContext): void => {
    const data = this.memory[address];
    this.emitMultiplexed("ui:memory:read:result", address, data);
  };
  onUiMemoryWrite = (address: number, data: number, ctx: EventContext): void => {
    this.memory[address] = data;
    this.emitMultiplexed("ui:memory:write:result", address, data);
  };
  onUiMemoryBulkWrite = (address: number, data: Uint8Array): void => {
    if (data.length > this.memory.length) {
      throw new Error(`[${this.id}] Attempted to write more data than memory size.`);
    }

    this.memory.set(data);
    this.emitMultiplexed("ui:memory:bulk:write:result", address, data);
  };
  onMemoryRead = (address: number) => {
    const data = this.memory[address];

    this.emitTimed("memory:read:result", address, data);
  };
  onMemoryWrite = (address: number, data: number) => {
    this.memory[address] = data;

    this.emitTimed("memory:write:result", address, data);
  };
}

export default Memory;
