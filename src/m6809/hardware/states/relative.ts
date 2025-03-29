import { signExtend, truncate } from "../../../general/numbers.js";
import { REGISTER_SIZE } from "../../util/cpu_parts.js";
import type { CycleStartFn, CycleEndFn } from "../../util/state_machine";

const start: CycleStartFn<"relative"> = ({ memoryPending, queryMemoryRead, cpu }, _) => {
  if (memoryPending) return;

  // Long branches read 16-bit values, short branches read 8-bit values.
  const readSize = cpu.instruction!.extra.isLongBranch ? 2 : 1;

  // Fetch the relative value.
  queryMemoryRead("pc", readSize);
};
const end: CycleEndFn<"relative"> = ({ memoryPending, memoryAction, cpu, registers }, _) => {
  if (memoryPending) return null;

  const long = cpu.instruction!.extra.isLongBranch;
  const value = memoryAction!.valueRead;
  const offset = long ? value : signExtend(value, 8, 16);

  cpu.addressing = {
    mode: "relative",
    long,
    offset,
    address: truncate(registers.pc + offset, 16),
  };

  cpu.onInstructionDecoded();
  return "execute";
};

export default { start, end };
