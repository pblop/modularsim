import type { CycleStartFn, CycleEndFn } from "../../util/state_machine.js";

const start: CycleStartFn<"extended"> = (
  { memoryPending, queryMemoryRead },
  { ctx, ticksOnState },
) => {
  if (ticksOnState === 0) {
    ctx.remainingTicks = 1;
    // Fetch the extended address.
    queryMemoryRead("pc", 2);
  }
};

const end: CycleEndFn<"extended"> = ({ memoryPending, cpu }, { ctx }) => {
  if (memoryPending) return null;

  const address = cpu.memoryAction!.valueRead;
  cpu.addressing = { mode: "extended", address };

  // Because of how the state machine is set up, if I add this extra tick,
  // the extended sta takes 1 more tick than it should.
  // If I remove it, the extended ldx takes 1 less tick than it should.
  if (ctx.remainingTicks !== 0) {
    ctx.remainingTicks--;
    return null;
  }

  return "execute";
};

export default { start, end };
