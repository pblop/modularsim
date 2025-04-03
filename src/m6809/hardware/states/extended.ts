import type { CycleEndFn, CycleStartFn } from "../../util/state_machine.js";

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

  if (ctx.remainingTicks !== 0) {
    ctx.remainingTicks--;
    return null;
  }

  cpu.onInstructionDecoded();
  return "execute";
};

export default { start, end };
