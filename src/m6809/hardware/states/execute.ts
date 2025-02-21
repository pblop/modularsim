// import { performInstructionLogic } from "../../util/instructions.js";
// import type { OnEnterFn, OnExitFn } from "../../util/state_machine";

// const enterExecute: OnEnterFn<"execute"> = (cpuInfo, stateInfo) => {
//   if (stateInfo.ctx.isDone === undefined) {
//     stateInfo.ctx.isDone = false;
//     stateInfo.ctx.instructionCtx = {};
//   }

//   const { cpu } = cpuInfo;

//   if (cpu.instruction === undefined) {
//     cpu.fail("No instruction to execute");
//     return false;
//   }
//   if (cpu.addressing === undefined) {
//     cpu.fail("No addressing mode to execute");
//     return false;
//   }

//   console.log(
//     `[${cpu.id}] Executing instruction ${cpu.instruction.mnemonic} ${cpu.addressing.mode}`,
//   );

//   const done = performInstructionLogic(cpuInfo, stateInfo, cpu.instruction, cpu.addressing);

//   stateInfo.ctx.isDone = done;
//   if (done) return true;
// };
// const exitExecute: OnExitFn<"execute"> = ({ cpu }, { ctx }) => {
//   if (!ctx.isDone) return null;

//   cpu.onInstructionFinish();
//   return "fetch_opcode";
// };

// export default { onEnter: enterExecute, onExit: exitExecute };
