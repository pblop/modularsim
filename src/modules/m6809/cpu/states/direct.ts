import { truncate } from "../../../../utils/numbers.js";
import type { CycleEndFn, CycleStartFn } from "../state_machine.js";

const start: CycleStartFn<"direct"> = ({ memoryPending, queryMemoryRead }, { ctx }) => {
  if (ctx.remainingTicks === undefined) ctx.remainingTicks = 1;
  if (memoryPending) return;

  if (ctx.remainingTicks === 1) {
    // Fetch the direct low byte.
    queryMemoryRead("pc", 1);
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

  cpu.onInstructionDecoded();
  return "execute";
};

export default { start, end };
