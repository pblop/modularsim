import { element, iconButton } from "../../../utils/html.js";
import { createLanguageStrings } from "../../../utils/lang.js";
import { UpdateQueue } from "../../../utils/updatequeue.js";
import type {
  EventContext,
  EventDeclaration,
  EventDeclarationListeners,
  TypedEventTransceiver,
} from "../../../types/event.js";
import type { IModule, ModuleDeclaration } from "../../../types/module.js";
import type { ISimulator } from "../../../types/simulator.js";
import { verify } from "../../../utils/config.js";

type ClockUIConfig = {
  frequency: number;
  autoReset: "reset" | "fast_reset" | "no";
  reloadFileOnReset: boolean;
};

type ClockUIState = {
  machineState: "running" | "paused" | "stopped" | "waiting_event";
  eventInfo: "finish_reset" | "file_loaded" | "file_loaded_finish_reset" | null;
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
          "dbg:program:reload",
        ],
        required: {
          "gui:panel_created": this.onGuiPanelCreated,
          "clock:paused": this.onClockPaused,
          "clock:started": this.onClockStarted,
          "signal:reset": this.onResetEvent,
        },
        optional: {
          "cpu:reset_finish": this.onResetFinish,
          "dbg:program:loaded": this.onProgramLoaded,
          "system:load_finish": this.onLoadFinish,
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

    this.config = verify<ClockUIConfig>(
      config,
      {
        frequency: { type: "number", default: 100 },
        autoReset: { type: "string", default: "fast_reset", enum: ["reset", "fast_reset", "no"] },
        reloadFileOnReset: {
          type: "boolean",
          default: true,
          required: false,
        },
      },
      `[${this.id}] configuration error: `,
    );
    this.state = {
      machineState: "stopped",
      lastCycleTime: 0,
      cycles: 0,
      eventInfo: null,
    };

    console.log(`[${this.id}] Module initialized.`);
  }

  setLanguage(language: string): void {
    this.language = language;
    this.localeStrings = ClockUIStrings[this.language] || ClockUIStrings.en;
  }

  onProgramLoaded = (programName: string): void => {
    if (this.state.machineState === "waiting_event") {
      if (this.state.eventInfo === "file_loaded") {
        this.updateFn?.({
          machineState: "paused",
          eventInfo: null,
          cycles: 0,
        });
        // We were waiting for the file to be loaded before resetting the CPU,
        // so we can now reset the CPU.
        this.event_transceiver.emit("signal:reset");
      } else if (this.state.eventInfo === "file_loaded_finish_reset") {
        this.updateFn?.({
          machineState: "waiting_event",
          eventInfo: "finish_reset",
          cycles: 0,
        });
        // Tell the clock to perform a fast reset.
        this.event_transceiver.emit("signal:reset");
        this.event_transceiver.emit("ui:clock:fast_reset");
      }
    }
  };

  onCycleStart = (): void => {
    // console.log(`[${this.id}] Clock cycle started`);
    this.updateFn?.({ lastCycleTime: performance.now(), cycles: this.state.cycles + 1 });
  };

  onClockPaused = (): void => {
    this.updateFn?.({ machineState: "paused", eventInfo: null });
  };
  onClockStarted = (): void => {
    if (this.state.machineState === "paused" || this.state.machineState === "stopped") {
      this.updateFn?.({ machineState: "running", eventInfo: null });
    }
  };

  /**
   * Callback used to automatically reset the system if required by the config.
   * - If config.autoReset is "reset", it performs a standard reset.
   * - If config.autoReset is "fast_reset", it performs a fast reset.
   */
  onLoadFinish = (): void => {
    if (this.config.autoReset === "reset") {
      this.onClickReset();
    } else if (this.config.autoReset === "fast_reset") {
      this.onClickFastReset();
    }
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
    `;
    const main = frag.content.querySelector(".clock-main")!;
    main.appendChild(iconButton("pause", this.localeStrings.pause, this.onClickPause));
    main.appendChild(iconButton("continue", this.localeStrings.continue, this.onClickContinue));
    main.appendChild(iconButton("step-cycle", this.localeStrings.stepCycle, this.onClickStepCycle));
    main.appendChild(
      iconButton(
        "step-instruction",
        this.localeStrings.stepInstruction,
        this.onClickStepInstruction,
      ),
    );
    main.appendChild(iconButton("reset", this.localeStrings.reset, this.onClickReset));
    main.appendChild(iconButton("fast-reset", this.localeStrings.fastReset, this.onClickFastReset));

    return frag;
  }

  onResetEvent = (context: EventContext): void => {
    console.log(`[${this.id}] Reset event received`, context);
    if (context.emitter === this.id) return;
    this.updateFn?.({ machineState: "paused", eventInfo: null, cycles: 0 });
  };

  onClickStepCycle = (): void => {
    this.event_transceiver.emit("ui:clock:step_cycle");
  };
  onClickStepInstruction = (): void => {
    this.updateFn?.({ machineState: "running" });
    this.event_transceiver.emit("ui:clock:step_instruction");
  };
  onClickPause = (): void => {
    this.updateFn?.({ machineState: "paused", eventInfo: null });
    this.event_transceiver.emit("ui:clock:pause");
  };
  onClickContinue = (): void => {
    this.updateFn?.({ machineState: "running" });
    this.event_transceiver.emit("ui:clock:start");
  };
  onClickReset = (): void => {
    if (this.config.reloadFileOnReset) {
      // If we want to reload the file on reset, we want to wait for the
      // "dbg:program:loaded" event to finish before resetting the CPU.
      this.updateFn?.({ machineState: "waiting_event", eventInfo: "file_loaded", cycles: 0 });
      this.event_transceiver.emit("dbg:program:reload");
    } else {
      this.updateFn?.({ machineState: "paused", cycles: 0 });
      this.event_transceiver.emit("signal:reset");
    }
  };
  onClickFastReset = (): void => {
    // Ask the system to perform a reset.
    if (this.config.reloadFileOnReset) {
      // If we want to reload the file on reset, we want to wait for the
      // "dbg:program:loaded" event to finish before resetting the CPU.
      this.updateFn?.({
        machineState: "waiting_event",
        eventInfo: "file_loaded_finish_reset",
        cycles: 0,
      });
      this.event_transceiver.emit("dbg:program:reload");
    } else {
      this.updateFn?.({ machineState: "paused", cycles: 0 });
      this.event_transceiver.emit("signal:reset");
    }
  };

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

    const internalUpdateFn = () => {
      if (this.state.machineState === "running" || this.state.machineState === "waiting_event")
        setRunningState();
      else if (this.state.machineState === "paused") setPausedState();
      else if (this.state.machineState === "stopped") setStoppedState();

      setCycleCount(this.state.cycles);
      tickAnimation();
    };
    this.updateQueue = new UpdateQueue(internalUpdateFn);
    this.updateFn = (data: Partial<ClockUIState>) => {
      if (data.machineState) this.state.machineState = data.machineState;
      if (data.cycles || data.cycles === 0) this.state.cycles = data.cycles;
      if (data.lastCycleTime) this.state.lastCycleTime = data.lastCycleTime;
      if (data.eventInfo || data.eventInfo === null) this.state.eventInfo = data.eventInfo;

      this.updateQueue!.queueUpdate();
    };

    this.state.machineState = "stopped";
    this.state.cycles = 0;
    this.state.lastCycleTime = 0;
    internalUpdateFn();

    this.panel?.appendChild(frag.content);
  }

  onResetFinish = (): void => {
    // debugger;
    if (this.state.machineState === "waiting_event" && this.state.eventInfo === "finish_reset") {
      this.updateFn?.({ machineState: "paused", eventInfo: null });
    }
  };
}

export default ClockUI;
