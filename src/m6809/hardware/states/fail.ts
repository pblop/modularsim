import { INSTRUCTIONS } from "../../util/instructions.js";
import type { CycleStartFn, CycleEndFn, CpuState } from "../../util/state_machine";

const start: CycleStartFn<CpuState> = ({ et }, _) => {
  et.emit("cpu:fail");
};
const end: CycleEndFn<CpuState> = () => {
  return null;
};

export default { start, end };
