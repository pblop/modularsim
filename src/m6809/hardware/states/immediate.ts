// import { REGISTER_SIZE } from "../../util/cpu_parts.js";
// import type { OnEnterFn, OnExitFn } from "../../util/state_machine";

// const enterImmediate: OnEnterFn<"immediate"> = ({ memoryPending, cpu, queryMemoryRead }, _) => {
//   if (memoryPending) return undefined;

//   // Fetch the immediate value.
//   const reg = cpu.instruction!.register;
//   const regSize = REGISTER_SIZE[reg];
//   queryMemoryRead("pc", regSize);
// };
// const exitImmediate: OnExitFn<"immediate"> = ({ memoryPending, memoryAction, cpu }, _) => {
//   if (memoryPending) return null;

//   // We have the immediate value, so we can store it in the addressing info.
//   const value = memoryAction!.valueRead;
//   cpu.addressing = { mode: "immediate", value };

//   // Perform instruction execution.
//   return "execute";
// };

// export default { onEnter: enterImmediate, onExit: exitImmediate };
