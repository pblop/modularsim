import { indexBit, isNegative, truncate, twosComplement } from "../../../general/numbers.js";
import type Cpu from "../../hardware/cpu";
import type { CpuAddressingData } from "../../hardware/cpu";
import { ConditionCodes, REGISTER_SIZE, type Registers } from "../cpu_parts.js";
import {
  type addInstructions as addInstructionsType,
  type ExecuteStateInfo,
  type GeneralAddressingMode,
  type Register,
  type Accumulator,
  retrieveReadAddressing,
  updateConditionCodes,
  queryReadAddressing,
  queryWrite,
} from "../instructions.js";
import type { AnyStateInfo, CpuInfo, CpuState, StateInfo } from "../state_machine";
import type { AllRegisters } from "./loadstore.js";

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
}
