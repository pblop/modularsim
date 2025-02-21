import { truncate } from "../../../general/numbers.js";
import type { CycleStartFn, CycleEndFn } from "../../util/state_machine";

const start: CycleStartFn<"direct"> = ({ memoryPending, queryMemoryRead }, { ctx }) => {
  if (ctx.remainingTicks === undefined) ctx.remainingTicks = 1;
  if (memoryPending) return false;

  if (ctx.remainingTicks === 1) {
    // Fetch the direct low byte.
    queryMemoryRead("pc", 1);
    return false;
  }
};
const end: CycleEndFn<"direct"> = ({ memoryPending, memoryAction, registers, cpu }, { ctx }) => {
  if (memoryPending) return null;

  const low = memoryAction!.valueRead;
  const address = truncate((registers.dp << 8) | low, 16);
  cpu.addressing = { mode: "direct", address };

  if (ctx.remainingTicks !== 0) {
    ctx.remainingTicks--;
    return null;
  }

  return "execute";
};

export default { start, end };
