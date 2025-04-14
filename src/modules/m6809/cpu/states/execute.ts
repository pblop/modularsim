import { performInstructionLogic } from "../instructions.js";
import type { CycleEndFn, CycleStartFn } from "../state_machine.js";

const start: CycleStartFn<"execute"> = (cpuInfo, stateInfo) => {
  if (stateInfo.ctx.isDone === undefined) {
    stateInfo.ctx.isDone = false;
    stateInfo.ctx.instructionCtx = {};
  }

  const { cpu } = cpuInfo;

  if (cpu.instruction === undefined) {
    cpu.fail("No instruction to execute");
    return;
  }
  if (cpu.addressing === undefined) {
    cpu.fail("No addressing mode to execute");
    return;
  }

  // console.log(
  //   `[${cpu.id}] Executing instruction ${cpu.instruction.mnemonic} ${cpu.addressing.mode}`,
  // );

  performInstructionLogic("start", cpuInfo, stateInfo, cpu.instruction, cpu.addressing);
};

const end: CycleEndFn<"execute"> = (cpuInfo, stateInfo) => {
  const { cpu } = cpuInfo;

  if (cpu.instruction === undefined) return cpu.fail("No instruction to execute");
  if (cpu.addressing === undefined) return cpu.fail("No addressing mode to execute");

  const done = performInstructionLogic("end", cpuInfo, stateInfo, cpu.instruction, cpu.addressing);
  if (!done) return null;

  cpu.onInstructionFinish();
  return "fetch";
};

export default { start, end };
