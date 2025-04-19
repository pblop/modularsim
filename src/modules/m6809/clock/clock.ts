import { clearTimer, setTimer } from "../../../utils/intervals.js";
import type { EventDeclaration, TypedEventTransceiver } from "../../../types/event.js";
import type {
  IModule,
  ModuleDeclaration,
  SimulationModuleInteraction,
} from "../../../types/module.js";
import type { ISimulator } from "../../../types/simulator.js";

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
  simulation: SimulationModuleInteraction;

  interval_id?: number;

  mode: "normal" | "instruction" | "fast_reset";

  getModuleDeclaration(): ModuleDeclaration {
    return {
      events: {
        provided: [],
        required: {
          "signal:reset": this.onResetSignal,
        },
        optional: {
          "ui:clock:start": this.onStartRequested,
          "ui:clock:pause": this.onPauseRequested,
          "ui:clock:step_cycle": this.onStepCycleRequested,
          "ui:clock:step_instruction": this.onStepInstructionRequested,
          "ui:clock:fast_reset": this.onFastResetRequested,
          "cpu:instruction_finish": this.onInstructionFinished,
          "cpu:reset_finish": this.onResetFinished,
        },
      },
      cycles: {
        initiator: true,
      },
    };
  }

  constructor(
    id: string,
    config: Record<string, unknown>,
    simulation: SimulationModuleInteraction,
  ) {
    this.id = id;
    this.config = validate_clock_config(config);
    this.simulation = simulation;

    this.mode = "normal";

    console.log(`[${this.id}] Module initialized.`);
  }

  sendCycleEvent = (): Promise<void> => {
    // The function that will be called every clock cycle.
    return this.simulation.performCycle();
  };

  stopInterval(): void {
    if (this.interval_id == null) return;
    console.log(`[${this.id}] Clock paused after ${performance.now() - this.startTime}ms`);

    clearTimer(this.interval_id);
    this.interval_id = undefined;
  }

  createInterval(): void {
    this.startTime = performance.now();

    // Send a clock cycle start event every 1/frequency seconds.
    this.interval_id = setTimer(this.sendCycleEvent, 1000 / this.config.frequency, {
      frequencyReportInterval: 1000,
      frequencyReportCallback: (frequency) => {
        console.log(`[${this.id}] Clock frequency: ${frequency}Hz`);
      },
      immediate: true,
    });
  }

  onResetSignal = (): void => {
    this.stopInterval();
  };

  startTime = 0;
  onStartRequested = (): void => {
    // If the interval is already running, do nothing.
    if (this.interval_id != null) return;

    this.createInterval();
  };
  onPauseRequested = (): void => {
    this.stopInterval();
    this.mode = "normal";
  };
  onStepCycleRequested = (): void => {
    this.simulation.performCycle();
  };
  onStepInstructionRequested = (): void => {
    this.mode = "instruction";
    this.onStartRequested();
  };
  onFastResetRequested = (): void => {
    this.mode = "fast_reset";
    this.onStartRequested();
  };
  onInstructionFinished = (): void => {
    if (this.mode === "instruction") {
      this.stopInterval();
      this.mode = "normal";
    }
  };
  onResetFinished = (): void => {
    if (this.mode === "fast_reset") {
      this.stopInterval();
      this.mode = "normal";
    }
  };
}

export default Clock;
