import type { OnEnterFn, OnExitFn } from "../../util/state_machine.js";

const enterExtended: OnEnterFn<"extended"> = ({ memoryPending, queryMemoryRead }, { ctx }) => {
  if (ctx.remainingTicks === undefined) ctx.remainingTicks = 1;
  if (memoryPending) return false;

  if (ctx.remainingTicks === 1) {
    // Fetch the extended address.
    queryMemoryRead("pc", 2);
    return false;
  }
};

const exitExtended: OnExitFn<"extended"> = ({ memoryPending, cpu }, { ctx }) => {
  if (memoryPending) return null;

  const address = cpu.memoryAction!.valueRead;
  cpu.addressing = { mode: "extended", address };

  if (ctx.remainingTicks !== 0) {
    ctx.remainingTicks--;
    return null;
  }

  return "execute";
};

export default { onEnter: enterExtended, onExit: exitExtended };
