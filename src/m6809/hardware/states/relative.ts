import { signExtend, truncate } from "../../../general/numbers.js";
import { REGISTER_SIZE } from "../../util/cpu_parts.js";
import type { CycleStartFn, CycleEndFn } from "../../util/state_machine";

const start: CycleStartFn<"relative"> = ({ memoryPending, queryMemoryRead }, _) => {
  if (memoryPending) return;

  // Fetch the relative value.
  // TODO: Implement LONG branches.
  queryMemoryRead("pc", 1);
};
const end: CycleEndFn<"relative"> = ({ memoryPending, memoryAction, cpu, registers }, _) => {
  if (memoryPending) return null;

  const long = false;
  const value = memoryAction!.valueRead;
  const offset = long ? value : signExtend(value, 8, 16);

  cpu.addressing = {
    mode: "relative",
    long,
    offset,
    address: truncate(registers.pc + offset, 16),
  };

  return "execute";
};

export default { start, end };
