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

type InterrupterConfig = {
  each: number;
  type: "nmi" | "irq" | "firq";
};

class Interrupter implements IModule {
  simulation: SimulationModuleInteraction;
  id: string;

  config: InterrupterConfig;

  getModuleDeclaration(): ModuleDeclaration {
    return {
      events: {
        provided: [`signal:${this.config.type}`],
        required: {},
        optional: {},
      },
      cycles: {
        permanent: [this.timerCallback],
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
    this.config = verify<InterrupterConfig>(
      config,
      {
        each: { type: "number", required: true },
        type: {
          type: "string",
          required: true,
          enum: ["nmi", "irq", "firq"],
        },
      },
      this.id,
    );

    console.log(`[${this.id}] Initialized module.`);
  }

  timerCallback = (cycle: number, subcycle: number): void => {
    // Emit the event signal.
    if (cycle !== 0 && cycle % this.config.each === 0) {
      this.simulation.emit(`signal:${this.config.type}`);
    }
  };
}

export default Interrupter;
