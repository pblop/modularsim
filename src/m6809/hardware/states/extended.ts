import type { CycleStartFn, CycleEndFn } from "../../util/state_machine.js";

const start: CycleStartFn<"extended"> = ({ memoryPending, queryMemoryRead }, { ticksOnState }) => {
  if (memoryPending) return;

  if (ticksOnState === 0) {
    // Fetch the extended address.
    queryMemoryRead("pc", 2);
  }
};

const end: CycleEndFn<"extended"> = ({ memoryPending, cpu }, { ctx }) => {
  if (memoryPending) return null;

  const address = cpu.memoryAction!.valueRead;
  cpu.addressing = { mode: "extended", address };

  return "execute";
};

export default { start, end };
