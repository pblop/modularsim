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

  interval_id?: number;

  getEventDeclaration(): EventDeclaration {
    return {
      provided: ["clock:cycle_start"],
      required: {
        "signal:reset": this.onResetSignal,
      },
      optional: {
        "ui:clock:start": this.onStartRequested,
        "ui:clock:pause": this.onPauseRequested,
        "ui:clock:step_cycle": this.onStepCycleRequested,
      },
    };
  }

  constructor(
    id: string,
    config: Record<string, unknown>,
    eventTransceiver: TypedEventTransceiver,
  ) {
    this.id = id;
    this.config = validate_clock_config(config);
    this.event_transceiver = eventTransceiver;

    console.log(`[${this.id}] Module initialized.`);
  }

  sendCycleEvent = (): void => {
    console.log(`[${this.id}] Clock cycle started`);

    // The function that will be called every clock cycle.
    this.event_transceiver.emit("clock:cycle_start");
  };

  stopInterval(): void {
    if (this.interval_id == null) return;

    clearInterval(this.interval_id);
    this.interval_id = undefined;
  }

  createInterval(): void {
    // Emit a cycle start event immediately, because setInterval will wait for
    // the delay before calling the function the first time.
    this.sendCycleEvent();

    // Send a clock cycle start event every 1/frequency seconds.
    this.interval_id = setInterval(this.sendCycleEvent, 1000 / this.config.frequency);
  }

  onResetSignal = (): void => {
    this.stopInterval();
  };

  onStartRequested = (): void => {
    // If the interval is already running, do nothing.
    if (this.interval_id != null) return;

    this.createInterval();
  };
  onPauseRequested = (): void => {
    this.stopInterval();
  };
  onStepCycleRequested = (): void => {
    this.event_transceiver.emit("clock:cycle_start");
  };
}

export default Clock;
