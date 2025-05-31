import { element, iconButton } from "../../../utils/html.js";
import { createLanguageStrings } from "../../../utils/lang.js";
import { UpdateQueue } from "../../../utils/updatequeue.js";
import type {
  EventContext,
  EventDeclaration,
  TypedEventTransceiver,
} from "../../../types/event.js";
import type { IModule, ModuleDeclaration } from "../../../types/module.js";
import type { ISimulator } from "../../../types/simulator.js";

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
  loadedProgram: string;
};

const ClockUIStrings = createLanguageStrings({
  en: {
    reset: "Reset",
    pause: "Pause",
    continue: "Continue",
    stepCycle: "Step (1 cycle)",
    stepInstruction: "Step (1 instruction)",
    fastReset: "Fast reset",
    loadedProgram: "Loaded program: ",
    none: "none",
  },
  es: {
    reset: "Reset",
    pause: "Pausar",
    continue: "Continuar",
    stepCycle: "Paso (1 ciclo)",
    stepInstruction: "Paso (1 instrucción)",
    fastReset: "Reset rápido",
    loadedProgram: "Programa cargado: ",
    none: "ninguno",
  },
});

class ClockUI implements IModule {
  id: string;
  event_transceiver: TypedEventTransceiver;

  config: ClockUIConfig;

  panel?: HTMLElement;

  updateFn?: (changes: Partial<ClockUIState>) => void;
  // State variables
  state: ClockUIState;

  language!: string;
  localeStrings!: typeof ClockUIStrings.en;
  updateQueue?: UpdateQueue;

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
          "dbg:program:loaded": this.onProgramLoaded,
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
      loadedProgram: "",
    };

    console.log(`[${this.id}] Module initialized.`);
  }

  setLanguage(language: string): void {
    this.language = language;
    this.localeStrings = ClockUIStrings[this.language] || ClockUIStrings.en;
  }

  onProgramLoaded = (programName: string): void => {
    console.log(`[${this.id}] Program loaded: ${programName}`);
    this.updateFn?.({ loadedProgram: programName });
  };

  onCycleStart = (): void => {
    // console.log(`[${this.id}] Clock cycle started`);
    this.updateFn?.({ lastCycleTime: performance.now(), cycles: this.state.cycles + 1 });
  };

  onClockPaused = (ctx: EventContext): void => {
    // We want to pause only if the emitter is not this module (to keep in
    // sync with the rest of the system).
    if (ctx.emitter === this.id) return;

    this.updateFn?.({ machineState: "paused" });
  };

  onGuiPanelCreated = (panel_id: string, panel: HTMLElement, language: string): void => {
    if (panel_id !== this.id) return;
    this.panel = panel;

    this.panel.classList.add("clock-ui");
    this.panel.style.setProperty("--clock-frequency", `${this.config.frequency}`);

    this.setLanguage(language);

    this.initUI();
  };

  createFrag(): HTMLTemplateElement {
    const frag = document.createElement("template");
    frag.innerHTML = `
      <div class="clock-main">

      </div>
      <div class="clock-extra">
        <div class="clock-marker gui-icon heartbeat"></div>
        <div class="clock-cycle-counter-container">
          <div class="gui-icon cycle-counter"></div>
          <div class="clock-cycle-counter">0</div>
        </div>
      </div>
      <div class="clock-loaded-program-container">
        <span>
          ${this.localeStrings.loadedProgram}
        </span>
        <span class="clock-loaded-program">${this.localeStrings.none}</span>
      </div>
    `;
    const main = frag.content.querySelector(".clock-main")!;
    main.appendChild(
      iconButton("pause", this.localeStrings.pause, () => {
        this.event_transceiver.emit("ui:clock:pause");
        this.updateFn!({ machineState: "paused" });
      }),
    );
    main.appendChild(
      iconButton("continue", this.localeStrings.continue, () => {
        this.event_transceiver.emit("ui:clock:start");
        this.updateFn!({ machineState: "running" });
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
        this.updateFn!({ machineState: "instruction_run" });
      }),
    );
    main.appendChild(
      iconButton("reset", this.localeStrings.reset, () => {
        this.event_transceiver.emit("signal:reset");
        this.updateFn!({ machineState: "paused", cycles: 0 });
      }),
    );
    main.appendChild(
      iconButton("fast-reset", this.localeStrings.fastReset, () => {
        this.event_transceiver.emit("signal:reset");
        this.updateFn!({ machineState: "fast_reset", cycles: 0 });
        this.event_transceiver.emit("ui:clock:fast_reset");
      }),
    );

    return frag;
  }

  initUI() {
    const frag = this.createFrag();

    const pauseButton = frag.content.querySelector("button:has(.pause)")! as HTMLElement;
    const continueButton = frag.content.querySelector("button:has(.continue)")! as HTMLElement;
    const stepCycleButton = frag.content.querySelector("button:has(.step-cycle)")! as HTMLElement;
    const stepInstructionButton = frag.content.querySelector(
      "button:has(.step-instruction)",
    )! as HTMLElement;
    const resetButton = frag.content.querySelector("button:has(.reset)")! as HTMLElement;
    const fastResetButton = frag.content.querySelector("button:has(.fast-reset)")! as HTMLElement;

    const loadedProgramSpan = frag.content.querySelector(
      ".clock-loaded-program",
    )! as HTMLSpanElement;

    const cycleCounter = frag.content.querySelector(".clock-cycle-counter")! as HTMLElement;
    const marker = frag.content.querySelector(".clock-marker")! as HTMLElement;

    const visibleButtons = [true, true, true, true, true, true];
    function setPauseVisible(visible: boolean) {
      if (visibleButtons[0] === visible) return;
      visibleButtons[0] = visible;
      pauseButton.style.display = visible ? "" : "none";
    }
    function setContinueVisible(visible: boolean) {
      if (visibleButtons[1] === visible) return;
      visibleButtons[1] = visible;
      continueButton.style.display = visible ? "" : "none";
    }
    function setStepCycleVisible(visible: boolean) {
      if (visibleButtons[2] === visible) return;
      visibleButtons[2] = visible;
      stepCycleButton.style.display = visible ? "" : "none";
    }
    function setStepInstructionVisible(visible: boolean) {
      if (visibleButtons[3] === visible) return;
      visibleButtons[3] = visible;
      stepInstructionButton.style.display = visible ? "" : "none";
    }
    function setResetVisible(visible: boolean) {
      if (visibleButtons[4] === visible) return;
      visibleButtons[4] = visible;
      resetButton.style.display = visible ? "" : "none";
    }
    function setFastResetVisible(visible: boolean) {
      if (visibleButtons[5] === visible) return;
      visibleButtons[5] = visible;
      fastResetButton.style.display = visible ? "" : "none";
    }

    let currentState = "";
    const setStoppedState = () => {
      if (currentState === "stopped") return;
      setPauseVisible(false);
      setContinueVisible(false);
      setStepCycleVisible(false);
      setStepInstructionVisible(false);
      setResetVisible(true);
      setFastResetVisible(true);
      currentState = "stopped";
    };
    const setRunningState = () => {
      if (currentState === "running") return;
      setPauseVisible(true);
      setContinueVisible(false);
      setStepCycleVisible(false);
      setStepInstructionVisible(false);
      setResetVisible(false);
      setFastResetVisible(false);
      currentState = "running";
    };
    const setPausedState = () => {
      if (currentState === "paused") return;
      setPauseVisible(false);
      setContinueVisible(true);
      setStepCycleVisible(true);
      setStepInstructionVisible(true);
      setResetVisible(true);
      setFastResetVisible(true);
      currentState = "paused";
    };

    let cycleCountValue = 0;
    const setCycleCount = (value: number) => {
      if (cycleCountValue !== value) {
        cycleCountValue = value;
        cycleCounter.textContent = `${cycleCountValue}`;
      }
    };

    let markerHasAnimation = false;
    let lastCycleTime = 0;
    const tickAnimation = () => {
      if (this.state.lastCycleTime !== lastCycleTime) {
        if (!markerHasAnimation) {
          marker.classList.add("clock-animation");
          markerHasAnimation = true;
        }

        marker.style.animation = "none";
        marker.offsetHeight; // Trigger reflow
        marker.style.animation = "";
        lastCycleTime = this.state.lastCycleTime;
      }
    };

    let currentProgramName = "";
    const updateLoadedProgram = (name: string) => {
      console.log(`[${this.id}] updateLoadedProgram: ${name}`);
      if (currentProgramName === name) return;
      currentProgramName = name;

      if (name.length === 0) {
        loadedProgramSpan.textContent = this.localeStrings.none;
      } else {
        loadedProgramSpan.textContent = name;
      }
    };

    const internalUpdateFn = () => {
      if (this.state.machineState === "running" || this.state.machineState === "instruction_run")
        setRunningState();
      else if (this.state.machineState === "paused") setPausedState();
      else if (this.state.machineState === "stopped") setStoppedState();

      setCycleCount(this.state.cycles);
      updateLoadedProgram(this.state.loadedProgram);
      tickAnimation();
    };
    this.updateQueue = new UpdateQueue(internalUpdateFn);
    this.updateFn = (data: Partial<ClockUIState>) => {
      if (data.machineState) this.state.machineState = data.machineState;
      if (data.cycles) this.state.cycles = data.cycles;
      if (data.lastCycleTime) this.state.lastCycleTime = data.lastCycleTime;
      if (data.loadedProgram) this.state.loadedProgram = data.loadedProgram;

      this.updateQueue!.queueUpdate();
    };

    this.state.machineState = "stopped";
    this.state.cycles = 0;
    this.state.lastCycleTime = 0;
    this.state.loadedProgram = "";
    internalUpdateFn();

    this.panel?.appendChild(frag.content);
  }

  onInstructionFinish = (): void => {
    if (this.state.machineState !== "instruction_run") return;
    this.updateFn?.({ machineState: "paused" });
  };
  onResetFinish = (): void => {
    if (this.state.machineState !== "fast_reset") return;
    this.updateFn?.({ machineState: "paused" });
  };
}

export default ClockUI;
