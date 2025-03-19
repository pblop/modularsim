import type { CycleStartFn, CycleEndFn } from "../../util/state_machine.js";

const start: CycleStartFn<"resetting"> = (
  { memoryPending, queryMemoryRead, config },
  { ticksOnState, ctx },
) => {
  if (memoryPending) return;

  if (ctx.remainingTicks === 3) {
    // Fetch the reset vector.
    queryMemoryRead(config.resetVector, 2);
  }
};

const end: CycleEndFn<"resetting"> = (
  { memoryPending, memoryAction, registers, commitRegisters, et },
  { ticksOnState, ctx },
) => {
  // This state is a bit special because of it being the "first" one. It
  // doesn't get entered into, so onExit actually gets called before onExit.
  // Doing the reading here and doing it in onEnter are, thus, functionally
  // equivalent (on the first cycle, both onExit and onEnter are called), so
  // I'm doing it on onEnter to be consistent with the other states.
  // That means that we need to set the remainingTicks here, and we need to make
  // sure that we only get the read value after we've read it!
  if (ticksOnState === 0) {
    ctx.remainingTicks = 7; // 7 cycles to reset.
    return null;
  }
  ctx.remainingTicks--;
  if (memoryPending || ctx.remainingTicks > 0) return null;

  // Clear all registers.
  // Set pc to the value stored at the reset vector.
  registers.dp = 0;
  registers.cc = 0;
  registers.D = 0;
  registers.X = 0;
  registers.Y = 0;
  registers.U = 0;
  registers.S = 0;
  registers.pc = memoryAction!.valueRead;
  commitRegisters();

  et.emit("cpu:reset_finish", registers);
  return "fetch";
};

export default { start, end };
