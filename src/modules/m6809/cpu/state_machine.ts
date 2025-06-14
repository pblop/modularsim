import type { EmptyObject } from "../../../types/common.js";
import type { TypedEventTransceiver } from "../../../types/event.js";
import type Cpu from "./cpu.js";
import type { CpuConfig, InstructionPostbyteInfo, RWHelper } from "./cpu.js";
import type { Registers } from "./cpu_parts.js";
import type { ParsedIndexedPostbyte } from "./instructions.js";

type StateContexts = {
  fail: EmptyObject;
  resetting: { remainingTicks: number };
  fetch: { opcode?: number; lastByteRead?: number };
  indexed_postbyte: EmptyObject;
  indexed_main: {
    baseAddress: number;
    offset: number;
    remainingTicks: number;
  };
  indexed_indirect: { remainingTicks: number };
  relative: EmptyObject;
  extended: { remainingTicks: number };
  direct: { remainingTicks: number };
  irqnmi: { interrupt: "irq" | "nmi" | "swi" | "swi2" | "swi3"; pushedRegisters: number };
  firq: { pushedRegisters: number };
  // I could type this correctly, but it's not worth the effort. Every
  // instruction can have a different context, so it's better to just use any.
  // biome-ignore lint/suspicious/noExplicitAny: <above>
  execute: { isDone: boolean; instructionCtx: any };
  customfn: EmptyObject;
};
export type CpuState = keyof StateContexts;

// This is the cpu information that is passed to the state functions.
export type CpuInfo = {
  memoryPending: boolean;
  queryMemoryRead: typeof Cpu.prototype.queryMemoryRead;
  queryMemoryReadStack: typeof Cpu.prototype.queryMemoryReadStack;
  queryMemoryWriteStack: typeof Cpu.prototype.queryMemoryWriteStack;
  queryMemoryWrite: typeof Cpu.prototype.queryMemoryWrite;
  config: CpuConfig;
  registers: Registers;
  memoryAction: RWHelper | null;
  commitRegisters: () => void;
  et: TypedEventTransceiver;
  sendInstructionExtra: (extra: InstructionPostbyteInfo) => void;
  cpu: Cpu;
};
export type AnyStateInfo = {
  ticksOnState: number;
  currentPart: "start" | "end";
};
export type StateInfo<S extends CpuState> = AnyStateInfo & {
  ctx: StateContexts[S];
};

/**
 * A function called on the first CPU subtick (0) of the simulation.
 */
export type CycleStartFn<S extends CpuState> = (cpuInfo: CpuInfo, stateInfo: StateInfo<S>) => void;
/**
 * A function called on the last CPU subtick (100) of the simulation.
 * Returns the next state, or null if self-transition.
 */
export type CycleEndFn<S extends CpuState> = (
  cpuInfo: CpuInfo,
  stateInfo: StateInfo<S>,
) => CpuState | null;

type StateFns = {
  [S in CpuState]: {
    start: CycleStartFn<S>;
    end: CycleEndFn<S>;
  };
};

export class StateMachine {
  current: CpuState;
  ctx: StateContexts[CpuState] | EmptyObject;
  ticksOnState: number;

  constructor(
    public stateFns: StateFns,
    startingState: CpuState,
  ) {
    this.current = startingState;
    this.ctx = {};
    this.ticksOnState = 0;
  }

  getStateInfo<S extends CpuState>(moment: "start" | "end"): StateInfo<S> {
    return {
      ctx: this.ctx as StateContexts[S],
      ticksOnState: this.ticksOnState,
      currentPart: moment,
    };
  }
  tick<S extends CpuState>(moment: "start" | "end", cpuInfo: CpuInfo): void {
    const currentFns = this.stateFns[this.current] as StateFns[S];
    if (currentFns == null) throw new Error(`[StateMachine] Unknown state: ${this.current}`);

    const stateInfo = this.getStateInfo<S>(moment);
    if (moment === "start") {
      currentFns.start(cpuInfo, stateInfo);
    } else {
      const nextState = currentFns.end(cpuInfo, stateInfo);
      if (nextState === null || nextState === this.current) {
        // self-transition
        // this is a special case, where we want to keep the state, but
        // increment the ticksOnState counter.
        this.ticksOnState++;
      } else {
        // transition to the a different state
        this.setState(nextState);
      }
    }
  }

  setState(state: CpuState): void {
    this.current = state;
    this.ticksOnState = 0;
    this.ctx = {};
  }
}
