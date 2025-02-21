import { performInstructionLogic } from "../../util/instructions.js";
import type { CycleStartFn, CycleEndFn } from "../../util/state_machine";

const start: CycleStartFn<"execute"> = (cpuInfo, stateInfo) => {
  if (stateInfo.ctx.isDone === undefined) {
    stateInfo.ctx.isDone = false;
    stateInfo.ctx.instructionCtx = {};
  }

  const { cpu } = cpuInfo;

  if (cpu.instruction === undefined) {
    cpu.fail("No instruction to execute");
    return false;
  }
  if (cpu.addressing === undefined) {
    cpu.fail("No addressing mode to execute");
    return false;
  }

  console.log(
    `[${cpu.id}] Executing instruction ${cpu.instruction.mnemonic} ${cpu.addressing.mode}`,
  );

  const done = performInstructionLogic(cpuInfo, stateInfo, cpu.instruction, cpu.addressing);

  stateInfo.ctx.isDone = done;
  if (done) return true;
};

const end: CycleEndFn<"execute"> = ({ cpu }, { ctx }) => {
  if (!ctx.isDone) return null;

  cpu.onInstructionFinish();
  return "fetch";
};

export default { start, end };
