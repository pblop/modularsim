// import { signExtend, truncate } from "../../../general/numbers.js";
// import { REGISTER_SIZE } from "../../util/cpu_parts.js";
// import type { OnEnterFn, OnExitFn } from "../../util/state_machine";

// const enterRelative: OnEnterFn<"relative"> = ({ memoryPending, queryMemoryRead }, _) => {
//   if (memoryPending) return false;

//   // Fetch the relative value.
//   // TODO: Implement LONG branches.
//   queryMemoryRead("pc", 1);
//   return false;
// };
// const exitRelative: OnExitFn<"relative"> = ({ memoryPending, memoryAction, cpu, registers }, _) => {
//   if (memoryPending) return null;

//   const long = false;
//   const value = memoryAction!.valueRead;
//   const offset = long ? value : signExtend(value, 8, 16);

//   cpu.addressing = {
//     mode: "relative",
//     long,
//     offset,
//     address: truncate(registers.pc + offset, 16),
//   };

//   return "execute";
// };

// export default { onEnter: enterRelative, onExit: exitRelative };
