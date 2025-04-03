import {
  indexBit,
  isNegative,
  signExtend,
  truncate,
  twosComplement,
} from "../../../general/numbers.js";
import type Cpu from "../../hardware/cpu.js";
import type { CpuAddressingData } from "../../hardware/cpu.js";
import { ConditionCodes, REGISTER_SIZE, type Registers } from "../cpu_parts.js";
import {
  type Accumulator,
  type ExecuteStateInfo,
  type GeneralAddressingMode,
  type Register,
  type addInstructions as addInstructionsType,
  queryReadAddressing,
  retrieveReadAddressing,
  updateConditionCodes,
} from "../instructions.js";
import type { CpuInfo, StateInfo } from "../state_machine.js";

function nop(_: Cpu, __: CpuInfo, { ticksOnState }: ExecuteStateInfo) {
  return ticksOnState === 1;
}

export default function (addInstructions: typeof addInstructionsType) {
  // nop
  addInstructions("nop", [[0x12, undefined, "inherent", "2"]], () => nop);
}
