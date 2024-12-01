import type { IModule } from "../../types/module";
import type { ISimulator } from "../../types/simulator";
import type { EventDeclaration, TypedEventTransceiver } from "../../types/event";

type ClockConfig = {
  // Frequency of the clock in Hz.
  frequency: number;
};

function validate_clock_config(config: Record<string, unknown>): ClockConfig {
  if (typeof config.frequency !== "number") throw new Error("[Clock] frequency must be a number");
  return config as ClockConfig;
}

class Clock implements IModule {
  id: string;
  config: ClockConfig;
  event_transceiver: TypedEventTransceiver;

  getEventDeclaration(): EventDeclaration {
    return {
      provided: ["clock:cycle_start"],
      required: [],
      optional: [],
    };
  }

  constructor(id: string, config: Record<string, unknown>, simulator: ISimulator) {
    this.id = id;
    this.config = validate_clock_config(config);
    this.event_transceiver = simulator;

    // Send a clock cycle start event every 1/frequency seconds.
    setInterval(() => {
      simulator.emit("clock:cycle_start");
    }, 1000 / this.config.frequency);

    console.log(`[${this.id}] Module initialized.`);
  }
}

export default Clock;
