import type { IModule, ModuleDeclaration } from "../../types/module";
import type { ISimulator } from "../../types/simulator";
import type { TypedEventTransceiver, EventDeclaration, EventContext } from "../../types/event";
import { element } from "../../general/html.js";
import { createLanguageStrings } from "../../general/lang.js";

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

    console.log(`[${this.id}] Module initialized.`);
  }

  setLanguage(language: string): void {
    this.language = language;
    this.localeStrings = ClockUIStrings[this.language] || ClockUIStrings.en;
  }

  onCycleStart = (): void => {
    console.log(`[${this.id}] Clock cycle started`);
    this.setState({ lastCycleTime: performance.now(), cycles: this.state.cycles + 1 });
  };

  onClockPaused = (ctx: EventContext): void => {
    // We want to pause only if the emitter is not this module (to keep in
    // sync with the rest of the system).
    if (ctx.emitter === this.id) return;

    this.setState({ machineState: "paused" });
  };

  setState(state: Partial<ClockUIState>): void {
    this.state = { ...this.state, ...state };
    this.draw(state);
  }

  draw(changes?: Partial<ClockUIState>): void {
    if (this.panel == null) return;

    if (!changes || "machineState" in changes) {
      const main = this.panel.querySelector(".clock-main");
      if (main == null) return; // This should never happen.
      main.innerHTML = "";

      if (this.state.machineState === "running" || this.state.machineState === "instruction_run") {
        main.appendChild(
          element(
            "button",
            {
              onclick: () => {
                this.event_transceiver.emit("ui:clock:pause");
                this.setState({ machineState: "paused" });
              },
            },
            element("span", {
              className: "clock-icon pause",
              title: this.localeStrings.pause,
            }),
          ),
        );
      }

      if (this.state.machineState === "paused") {
        main.appendChild(
          element(
            "button",
            {
              onclick: () => {
                this.event_transceiver.emit("ui:clock:start");
                this.setState({ machineState: "running" });
              },
            },
            element("span", {
              className: "clock-icon continue",
              title: this.localeStrings.continue,
            }),
          ),
        );
        main.appendChild(
          element(
            "button",
            {
              onclick: () => {
                this.event_transceiver.emit("ui:clock:step_cycle");
              },
            },
            element("span", {
              className: "clock-icon step-cycle",
              title: this.localeStrings.stepCycle,
            }),
          ),
        );
        main.appendChild(
          element(
            "button",
            {
              onclick: () => {
                this.event_transceiver.emit("ui:clock:step_instruction");
                this.setState({ machineState: "instruction_run" });
              },
            },
            element("span", {
              className: "clock-icon step-instruction",
              title: this.localeStrings.stepInstruction,
            }),
          ),
        );
      }

      if (this.state.machineState === "paused" || this.state.machineState === "stopped") {
        main.appendChild(
          element(
            "button",
            {
              onclick: () => {
                this.event_transceiver.emit("signal:reset");
                this.setState({ machineState: "paused", cycles: 0 });
              },
            },
            element("span", {
              className: "clock-icon reset",
              title: this.localeStrings.reset,
            }),
          ),
        );
        main.appendChild(
          element(
            "button",
            {
              onclick: () => {
                this.event_transceiver.emit("signal:reset");
                this.setState({ machineState: "fast_reset", cycles: 0 });
                this.event_transceiver.emit("ui:clock:fast_reset");
              },
            },
            element("span", {
              className: "clock-icon fast-reset",
              title: this.localeStrings.fastReset,
            }),
          ),
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
        element("div", { className: "clock-marker clock-icon heartbeat" }),
        element(
          "div",
          { className: "clock-cycle-counter-container" },
          element("div", { className: "clock-icon cycle-counter" }),
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
