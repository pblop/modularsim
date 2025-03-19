import { REGISTER_SIZE } from "../../util/cpu_parts.js";
import type { CycleStartFn, CycleEndFn } from "../../util/state_machine";

// NOTE: This file is _not_ used, and the update to allow for EXG, TFR, etc.
// instructions wasn't completed.
const start: CycleStartFn<"immediate"> = (
  { memoryPending, cpu, queryMemoryRead },
  { ticksOnState },
) => {
  // Fetch the immediate value.
  if (ticksOnState === 0) {
    const reg = cpu.instruction!.register;
    // In the case of an undefined register, like in the case of an EXG or TFR instruction,
    // where the addressing mode is immediate, but the value is not stored in a register,
    // we read a single byte.
    const regSize = reg === undefined ? 1 : REGISTER_SIZE[reg];
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
