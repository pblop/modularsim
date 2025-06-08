import { verify } from "../../../utils/config.js";
import type { TypedEventTransceiver } from "../../../types/event.js";
import type { IModule, ModuleDeclaration } from "../../../types/module.js";

type MessagerConfig = {};

class Messager implements IModule {
  et: TypedEventTransceiver;
  id: string;

  config: MessagerConfig;

  currentClockState: "paused" | "running" | "step" = "paused";
  currentProgramState: "ok" | "finished" = "ok";
  cyclesInInstruction = 0;
  isInInstruction = false;

  getModuleDeclaration(): ModuleDeclaration {
    return {
      events: {
        provided: ["ui:message:status"],
        required: {},
        optional: {
          "dbg:program:loaded": this.onProgramLoaded,
          "cpu:instruction_begin": this.onInstructionBegin,
          "cpu:instruction_finish": this.onInstructionFinish,
          "ui:clock:step_cycle": this.setClockStep,
          "ui:clock:step_instruction": this.setClockStep,
          "ui:clock:start": this.setClockRunning,
          "clock:paused": this.setClockPause,
          "ui:clock:fast_reset": this.setClockRunning,
          "stop:finished": this.onFinished,
        },
      },
      cycles: {
        permanent: [[this.onCycle, { subcycle: -999 }]],
      },
    };
  }

  onCycle = (): void => {
    this.currentProgramState = "ok";
    this.cyclesInInstruction++;
    if (this.isInInstruction && this.currentClockState !== "running") {
      this.sendPerformingInstruction();
    }
  };

  onProgramLoaded = (name: string): void => {
    this.et.emit("ui:message:status", `Program loaded: ${name}.`);
  };
  setClockStep = (): void => {
    this.currentClockState = "step";
    this.currentProgramState = "ok";
  };
  setClockRunning = (): void => {
    this.currentClockState = "running";
    this.currentProgramState = "ok";
    this.sendRunningMessage();
  };
  setClockPause = (): void => {
    this.currentClockState = "paused";

    if (this.currentProgramState === "finished") return;
    this.sendPausedMessage();
  };

  onInstructionBegin = (pc: number): void => {
    this.cyclesInInstruction = 0;
    this.isInInstruction = true;
    if (this.currentClockState !== "running") {
      this.sendPerformingInstruction();
    }
  };
  onInstructionFinish = (): void => {
    this.isInInstruction = false;
    if (this.currentClockState !== "running" && this.currentProgramState === "ok") {
      this.sendFinishedInstruction();
    }
  };
  onFinished = (): void => {
    this.et.emit("ui:message:status", "Stopped.");
    this.currentProgramState = "finished";
  };

  sendPerformingInstruction(): void {
    this.et.emit(
      "ui:message:status",
      `Performing instruction, ${this.cyclesInInstruction + 1} cycles in.`,
    );
  }
  sendFinishedInstruction(): void {
    this.et.emit(
      "ui:message:status",
      `Finished instruction in ${this.cyclesInInstruction + 1} cycles.`,
    );
  }
  sendRunningMessage(): void {
    this.et.emit("ui:message:status", "Running.");
  }
  sendPausedMessage(): void {
    this.et.emit("ui:message:status", "Paused.");
  }

  constructor(
    id: string,
    config: Record<string, unknown> | undefined,
    eventTransceiver: TypedEventTransceiver,
  ) {
    // We use the simulator to emit/receive events.
    this.et = eventTransceiver;
    this.id = id;

    this.config = verify<MessagerConfig>(config, {}, this.id);

    console.log(`[${this.id}] Initializing messager module.`);
  }
}

export default Messager;
