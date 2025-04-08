import { element, iconButton } from "../../general/html.js";
import { createLanguageStrings } from "../../general/lang.js";
import { UpdateQueue } from "../../general/updatequeue.js";
import type { EventContext, EventDeclaration, TypedEventTransceiver } from "../../types/event.js";
import type { IModule, ModuleDeclaration } from "../../types/module.js";
import type { ISimulator } from "../../types/simulator.js";

type ClockUIConfig = {
  frequency: number;
};

function verifyClockUIConfig(config: Record<string, unknown>): ClockUIConfig {
  if (typeof config.frequency !== "number") throw new Error("[ClockUI] frequency must be a number");
  return config as ClockUIConfig;
}

type ClockUIState = {
  machineState: "running" | "instruction_run" | "paused" | "stopped" | "fast_reset";
  lastCycleTime: number;
  cycles: number;
};

const ClockUIStrings = createLanguageStrings({
  en: {
    reset: "Reset",
    pause: "Pause",
    continue: "Continue",
    stepCycle: "Step (1 cycle)",
    stepInstruction: "Step (1 instruction)",
    fastReset: "Fast reset",
  },
  es: {
    reset: "Reset",
    pause: "Pausar",
    continue: "Continuar",
    stepCycle: "Paso (1 ciclo)",
    stepInstruction: "Paso (1 instrucción)",
    fastReset: "Reset rápido",
  },
});

class ClockUI implements IModule {
  id: string;
  event_transceiver: TypedEventTransceiver;

  config: ClockUIConfig;

  panel?: HTMLElement;
  state: ClockUIState;

  language!: string;
  localeStrings!: typeof ClockUIStrings.en;
  updateQueue: UpdateQueue<Partial<ClockUIState>>;

  getModuleDeclaration(): ModuleDeclaration {
    return {
      events: {
        provided: [
          "signal:reset",
          "ui:clock:step_cycle",
          "ui:clock:pause",
          "ui:clock:start",
          "ui:clock:step_instruction",
          "ui:clock:fast_reset",
        ],
        required: {
          "gui:panel_created": this.onGuiPanelCreated,
          "cpu:instruction_finish": this.onInstructionFinish,
          "ui:clock:pause": this.onClockPaused,
        },
        optional: {
          "cpu:reset_finish": this.onResetFinish,
        },
      },
      cycles: {
        permanent: [[this.onCycleStart, { subcycle: -9999 }]],
      },
    };
  }

  constructor(
    id: string,
    config: Record<string, unknown>,
    eventTransceiver: TypedEventTransceiver,
  ) {
    this.id = id;
    this.event_transceiver = eventTransceiver;

    this.config = verifyClockUIConfig(config);

    this.state = {
      machineState: "stopped",
      lastCycleTime: 0,
      cycles: 0,
    };

    this.updateQueue = new UpdateQueue(this.refreshUI);
    console.log(`[${this.id}] Module initialized.`);
  }

  setLanguage(language: string): void {
    this.language = language;
    this.localeStrings = ClockUIStrings[this.language] || ClockUIStrings.en;
  }

  onCycleStart = (): void => {
    // console.log(`[${this.id}] Clock cycle started`);
    this.setState({ lastCycleTime: performance.now(), cycles: this.state.cycles + 1 });
  };

  onClockPaused = (ctx: EventContext): void => {
    // We want to pause only if the emitter is not this module (to keep in
    // sync with the rest of the system).
    if (ctx.emitter === this.id) return;

    this.setState({ machineState: "paused" });
  };

  setState(stateChange: Partial<ClockUIState>): void {
    Object.assign(this.state, stateChange);
    this.updateQueue.queueUpdate(stateChange);
  }

  refreshUI = (changes: Partial<ClockUIState>[]): void => {
    this.draw(Object.assign({}, ...changes));
  };

  draw(changes?: Partial<ClockUIState>): void {
    if (this.panel == null) return;

    if (!changes || "machineState" in changes) {
      const main = this.panel.querySelector(".clock-main");
      if (main == null) return; // This should never happen.
      main.innerHTML = "";

      if (this.state.machineState === "running" || this.state.machineState === "instruction_run") {
        main.appendChild(
          iconButton("pause", this.localeStrings.pause, () => {
            this.event_transceiver.emit("ui:clock:pause");
            this.setState({ machineState: "paused" });
          }),
        );
      }

      if (this.state.machineState === "paused") {
        main.appendChild(
          iconButton("continue", this.localeStrings.continue, () => {
            this.event_transceiver.emit("ui:clock:start");
            this.setState({ machineState: "running" });
          }),
        );
        main.appendChild(
          iconButton("step-cycle", this.localeStrings.stepCycle, () => {
            this.event_transceiver.emit("ui:clock:step_cycle");
          }),
        );
        main.appendChild(
          iconButton("step-instruction", this.localeStrings.stepInstruction, () => {
            this.event_transceiver.emit("ui:clock:step_instruction");
            this.setState({ machineState: "instruction_run" });
          }),
        );
      }

      if (this.state.machineState === "paused" || this.state.machineState === "stopped") {
        main.appendChild(
          iconButton("reset", this.localeStrings.reset, () => {
            this.event_transceiver.emit("signal:reset");
            this.setState({ machineState: "paused", cycles: 0 });
          }),
        );
        main.appendChild(
          iconButton("fast-reset", this.localeStrings.fastReset, () => {
            this.event_transceiver.emit("signal:reset");
            this.setState({ machineState: "fast_reset", cycles: 0 });
            this.event_transceiver.emit("ui:clock:fast_reset");
          }),
        );
      }
    }

    if (changes && "lastCycleTime" in changes) {
      const marker = this.panel.querySelector(".clock-marker") as HTMLElement;
      if (marker == null) return; // This should never happen.
      if (!marker.classList.contains(".clock-animation")) marker.classList.add("clock-animation");

      marker.style.animation = "none";
      marker.offsetHeight; // Trigger reflow
      marker.style.animation = "";
    }
    if (changes && "cycles" in changes) {
      const cycles = this.panel.querySelector(".clock-cycle-counter") as HTMLElement;
      if (cycles == null) return; // This should never happen.
      cycles.textContent = `${this.state.cycles}`;
    }
  }

  onGuiPanelCreated = (panel_id: string, panel: HTMLElement, language: string): void => {
    if (panel_id !== this.id) return;
    this.panel = panel;

    this.panel.classList.add("clock-ui");
    this.panel.style.setProperty("--clock-frequency", `${this.config.frequency}`);

    this.setLanguage(language);

    this.panel.appendChild(element("div", { className: "clock-main" }));
    this.panel.appendChild(
      element(
        "div",
        {
          className: "clock-extra",
        },
        element("div", { className: "clock-marker gui-icon heartbeat" }),
        element(
          "div",
          { className: "clock-cycle-counter-container" },
          element("div", { className: "gui-icon cycle-counter" }),
          element("div", { className: "clock-cycle-counter", textContent: "0" }),
        ),
      ),
    );

    this.draw();
  };

  onInstructionFinish = (): void => {
    if (this.state.machineState !== "instruction_run") return;
    this.setState({ machineState: "paused" });
  };
  onResetFinish = (): void => {
    if (this.state.machineState !== "fast_reset") return;
    this.setState({ machineState: "paused" });
  };
}

export default ClockUI;
