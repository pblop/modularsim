import {
  indexBit,
  isNegative,
  signExtend,
  truncate,
  twosComplement,
} from "../../../../utils/numbers.js";
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
  retrieveReadAddressing,
  updateConditionCodes,
} from "../instructions.js";
import type { CpuInfo, StateInfo } from "../state_machine.js";

function nop() {
  return true;
}

function daa(_: Cpu, { registers }: CpuInfo, { ticksOnState }: ExecuteStateInfo) {
  let untruncated = registers.A;
  const msn = registers.A & 0xf0; // most significant nibble
  const lsn = registers.A & 0x0f; // least significant nibble

  if (registers.cc & ConditionCodes.HALF_CARRY || lsn > 0x09) untruncated += 0x06;
  if (registers.cc & ConditionCodes.CARRY || msn > 0x90 || (msn > 0x80 && lsn > 0x09))
    untruncated += 0x60;

  const result = truncate(untruncated, 8);
  registers.A = result;

  // CC: N, Z, V(undefined), C
  updateConditionCodes(registers, {
    N: isNegative(result, 8),
    Z: result === 0,
    // This C flag is not actually exactly what the 6809 does, but it is what
    // the manual says, source:
    // https://github.com/cavnex/mc6809/blob/17e94a6ef163be8b79a9b15b2e814847b6062f0f/mc6809i.v#L1921
    C: untruncated & 0x100,
  });

  return true;
}

export default function (addInstructions: typeof addInstructionsType) {
  // nop
  addInstructions("nop", [[0x12, undefined, "inherent", "2"]], () => nop);

  // daa
  addInstructions("daa", [[0x19, undefined, "inherent", "2"]], () => daa);
}
