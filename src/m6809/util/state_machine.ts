import type { EmptyObject } from "../../types/common.js";
import type { ParsedIndexedPostbyte } from "./instructions.js";

export type CpuState =
  | "unreset"
  | "start"
  | "fetch_opcode"
  | "immediate"
  | "indexed_postbyte"
  | "indexed_main"
  | "indexed_indirect"
  | "relative"
  | "extended"
  | "direct"
  | "fail"
  | "execute";

type StateContexts = {
  unreset: EmptyObject;
  start: EmptyObject;
  fetch_opcode: { opcode?: number };
  immediate: EmptyObject;
  indexed_postbyte: EmptyObject;
  indexed_main: {
    baseAddress: number;
    offset: number;
    remainingTicks: number;
  };
  indexed_indirect: { remainingTicks: number };
  relative: EmptyObject;
  extended: EmptyObject;
  direct: EmptyObject;
  // I could type this correctly, but it's not worth the effort. Every
  // instruction can have a different context, so it's better to just use any.
  // biome-ignore lint/suspicious/noExplicitAny: <above>
  execute: { isDone: boolean; instructionCtx: any };
  fail: EmptyObject;
};

// This is the cpu information that is passed to the state functions.
export type CpuInfo = {
  readPending: boolean;
  writePending: boolean;
};
export type StateInfo<S extends CpuState> = {
  ctx: StateContexts[S];
  ticksOnState: number;
  // Whether the transition that lead to this state was immediate (i.e., no tick was added).
  immediateTick: boolean;
};

export type OnEnterFn<S extends CpuState> = (
  cpuInfo: CpuInfo,
  stateInfo: StateInfo<S>,
  // biome-ignore lint/suspicious/noConfusingVoidType: if I don't use void, TypeScript complains.q
) => boolean | undefined | void;
// Returns the next state, or null if self-transition.
export type OnExitFn<S extends CpuState> = (
  cpuInfo: CpuInfo,
  stateInfo: StateInfo<S>,
) => CpuState | null;

type StateFns = {
  [S in CpuState]: {
    // A function called when this state is entered.
    onEnter: OnEnterFn<S>;
    // A function that, given the current state, returns the next state.
    onExit: OnExitFn<S>;
  };
};

// TODO: Make this generic
export class StateMachine {
  current: CpuState;
  ctx: StateContexts | EmptyObject;
  ticksOnState: number;

  constructor(
    public stateFns: StateFns,
    startingState: CpuState,
  ) {
    this.current = startingState;
    this.ctx = {};
    this.ticksOnState = 0;
  }

  getStateInfo<S extends CpuState>(immediateTick: boolean): StateInfo<S> {
    return { ctx: this.ctx as StateContexts[S], ticksOnState: this.ticksOnState, immediateTick };
  }

  /**
   * Performs a tick on the current state. That is:
   * - Calls the current state's exit function (and updates the state info if needed).
   * - Calls the next state's enter function.
   * @param cpuInfo The CPU information.
   * @param immediateTick Whether to _not_ add a tick to the current state (default: false),
   * will be set to true when onEnter requires an immediate transition (because it
   * technically doesn't tick, but I want all the tick functionality).
   */
  tick(cpuInfo: CpuInfo, immediateTick = false): void {
    const currentFns = this.stateFns[this.current];
    if (currentFns == null) throw new Error(`[StateMachine] Unknown state: ${this.current}`);

    // Call the current state's exit function to know the next state (and update it if needed).

    // This is a bit of a hack to make TypeScript happy. The context type is based on the
    // current state, but I don't know how to make TypeScript understand that.
    const nextState = (currentFns.onExit as OnExitFn<CpuState>)(
      cpuInfo,
      this.getStateInfo<CpuState>(immediateTick),
    );
    if (nextState != null && nextState !== this.current) {
      // Update the state info if we're indeed changing state
      this.current = nextState;
      this.ctx = {};
      this.ticksOnState = 0;
    } else {
      if (!immediateTick) this.ticksOnState++;
    }

    const nextFns = this.stateFns[this.current];
    if (nextFns == null) throw new Error(`[StateMachine] Unknown state: ${this.current}`);

    const isImmediate = (nextFns.onEnter as OnEnterFn<CpuState>)(
      cpuInfo,
      this.getStateInfo<CpuState>(immediateTick),
    );

    if (isImmediate) this.tick(cpuInfo, true);
  }

  /**
   * Transition to a new state (without calling the exit function). This is useful for
   * error handling.
   * @param state The new state.
   * @param info The information to pass to the new state's enter function.
   */
  forceTransition(state: CpuState, cpuInfo: CpuInfo): void {
    this.current = state;
    this.ticksOnState = 0;
    this.ctx = {};

    const nextFns = this.stateFns[this.current];
    if (nextFns == null) throw new Error(`[StateMachine] Unknown state: ${this.current}`);

    (nextFns.onEnter as OnEnterFn<CpuState>)(cpuInfo, this.getStateInfo<CpuState>(false));
  }

  setState(state: CpuState): void {
    this.current = state;
    this.ctx = {};
    this.ticksOnState = 0;
  }
}
