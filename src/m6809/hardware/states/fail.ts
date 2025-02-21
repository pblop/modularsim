import { INSTRUCTIONS } from "../../util/instructions.js";
import type { CycleStartFn, CycleEndFn, CpuState } from "../../util/state_machine";

// You might have noticed that all the other states' CycleStartFn and CycleEndFn
// functions use the correct type parameter for the state they're in, and this
// one instead opts for the generic CpuState type.  This is because it's useful
// to be able to use this fail state in place of a correct implementation of
// another state, for preventign typing errors, when implementing the other
// states.

const start: CycleStartFn<CpuState> = ({ et }, _) => {
  et.emit("cpu:fail");
};
const end: CycleEndFn<CpuState> = () => {
  return null;
};

export default { start, end };
