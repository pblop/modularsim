import { indexBit, isNegative, truncate, twosComplement } from "../../../../utils/numbers.js";
import type Cpu from "../cpu.js";
import type { CpuAddressingData } from "../cpu.js";
import { ConditionCodes, REGISTER_SIZE, type Registers } from "../cpu_parts.js";
import {
  type Accumulator,
  type ExecuteStateInfo,
  type GeneralAddressingMode,
  type Register,
  type addInstructions as addInstructionsType,
  queryReadAddressing,
  queryWrite,
  retrieveReadAddressing,
  updateConditionCodes,
} from "../instructions.js";
import type { AnyStateInfo, CpuInfo, CpuState, StateInfo } from "../state_machine.js";
import type { AllRegisters } from "./loadstore.js";
import { FIRQ_NMI_STACK_REGISTERS, IRQNMI_STACK_REGISTERS, pullRegisters } from "./stack.js";

function rtiStart(cpu: Cpu, cpuInfo: CpuInfo, stateInfo: ExecuteStateInfo) {
  const { registers } = cpu;
  const { memoryAction } = cpuInfo;
  const {
    ctx: { instructionCtx },
    ticksOnState,
  } = stateInfo;

  if (ticksOnState === 0) {
    // If the E flag is set, we pull the entire register set, otherwise, just
    // PC and CC.
    instructionCtx.regsToPull =
      registers.cc & ConditionCodes.ENTIRE_FLAG
        ? IRQNMI_STACK_REGISTERS.slice().reverse()
        : FIRQ_NMI_STACK_REGISTERS.slice().reverse();
  }

  pullRegisters(cpuInfo, stateInfo, "S", instructionCtx.regsToPull, instructionCtx, "i");
}

function rtiEnd(cpu: Cpu, cpuInfo: CpuInfo, stateInfo: ExecuteStateInfo) {
  const {
    ctx: { instructionCtx },
  } = stateInfo;

  return pullRegisters(cpuInfo, stateInfo, "S", instructionCtx.regsToPull, instructionCtx, "i");
}

export default function (addInstructions: typeof addInstructionsType) {
  addInstructions(
    "swi",
    [[0x3f, undefined, "inherent", "19"]],
    (_, __, ___, ____) => (cpu, cpuInfo, stateInfo, addr, regs) => true,
    { swi: 1 },
  );
  addInstructions(
    "swi2",
    [[0x103f, undefined, "inherent", "20"]],
    (_, __, ___, ____) => (cpu, cpuInfo, stateInfo, addr, regs) => true,
    { swi: 2 },
  );
  addInstructions(
    "swi3",
    [[0x113f, undefined, "inherent", "20"]],
    (_, __, ___, ____) => (cpu, cpuInfo, stateInfo, addr, regs) => true,
    { swi: 3 },
  );

  // TODO: RTI
  addInstructions("rti", [[0x3b, undefined, "inherent", "6/15"]], (_, __, ___, ____) => ({
    start: (cpu, cpuInfo, stateInfo, addr, regs) => rtiStart(cpu, cpuInfo, stateInfo),
    end: (cpu, cpuInfo, stateInfo, addr, regs) => rtiEnd(cpu, cpuInfo, stateInfo),
  }));
}
