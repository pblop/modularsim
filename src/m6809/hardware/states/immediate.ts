import { REGISTER_SIZE } from "../../util/cpu_parts.js";
import type { CycleStartFn, CycleEndFn } from "../../util/state_machine";

const start: CycleStartFn<"immediate"> = (
  { memoryPending, cpu, queryMemoryRead },
  { ticksOnState },
) => {
  // Fetch the immediate value.
  if (ticksOnState === 0) {
    const reg = cpu.instruction!.register;
    if (reg === undefined) throw new Error("Register not defined for immediate instruction.");

    const regSize = REGISTER_SIZE[reg];
    queryMemoryRead("pc", regSize);
  }
};
const end: CycleEndFn<"immediate"> = ({ memoryPending, memoryAction, cpu }, _) => {
  if (memoryPending) return null;

  // We have the immediate value, so we can store it in the addressing info.
  const value = memoryAction!.valueRead;
  cpu.addressing = { mode: "immediate" };

  // Perform instruction execution.
  return "execute";
};

export default { start, end };
