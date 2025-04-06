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
  type TwoOpInstructionFunction,
  addInstructions2Operand,
  type addInstructions as addInstructionsType,
  queryReadAddressing,
  retrieveReadAddressing,
  updateConditionCodes,
} from "../instructions.js";
import type { CpuInfo, StateInfo } from "../state_machine.js";

const and8: TwoOpInstructionFunction = (a: number, b: number, bits: number, regs: Registers) => {
  const result = a & b;

  // CC: N, Z, V
  return [
    result,
    {
      N: isNegative(result, bits),
      Z: result === 0,
      V: 0,
    },
  ];
};

const andcc: TwoOpInstructionFunction = (a: number, b: number, bits: number, regs: Registers) => {
  return [a & b, {}];
};

const eor8: TwoOpInstructionFunction = (a: number, b: number, bits: number, regs: Registers) => {
  const result = a ^ b;

  // CC: N, Z, V
  return [
    result,
    {
      N: isNegative(result, bits),
      Z: result === 0,
      V: 0,
    },
  ];
};

const or8: TwoOpInstructionFunction = (a: number, b: number, bits: number, regs: Registers) => {
  const result = a | b;
  // CC: N, Z, V
  return [
    result,
    {
      N: isNegative(result, bits),
      Z: result === 0,
      V: 0,
    },
  ];
};

const orcc: TwoOpInstructionFunction = (a: number, b: number, bits: number, regs: Registers) => {
  return [a | b, {}];
};

export default function (addInstructions: typeof addInstructionsType) {
  // and8 (anda, andb)
  addInstructions2Operand(
    "and{register}",
    [
      [0x84, "A", "immediate", "2"],
      [0x94, "A", "direct", "4"],
      [0xa4, "A", "indexed", "4+"],
      [0xb4, "A", "extended", "5"],
      [0xc4, "B", "immediate", "2"],
      [0xd4, "B", "direct", "4"],
      [0xe4, "B", "indexed", "4+"],
      [0xf4, "B", "extended", "5"],
    ],
    and8,
    0,
  );
  // andcc
  addInstructions2Operand("andcc", [[0x1c, "cc", "immediate", "3"]], andcc, 0);

  // eor8 (eora, eorb)
  addInstructions2Operand(
    "eor{register}",
    [
      [0x88, "A", "immediate", "2"],
      [0x98, "A", "direct", "4"],
      [0xa8, "A", "indexed", "4+"],
      [0xb8, "A", "extended", "5"],
      [0xc8, "B", "immediate", "2"],
      [0xd8, "B", "direct", "4"],
      [0xe8, "B", "indexed", "4+"],
      [0xf8, "B", "extended", "5"],
    ],
    eor8,
    0,
  );

  // or8 (ora, orb)
  addInstructions2Operand(
    "or{register}",
    [
      [0x8a, "A", "immediate", "2"],
      [0x9a, "A", "direct", "4"],
      [0xaa, "A", "indexed", "4+"],
      [0xba, "A", "extended", "5"],
      [0xca, "B", "immediate", "2"],
      [0xda, "B", "direct", "4"],
      [0xea, "B", "indexed", "4+"],
      [0xfa, "B", "extended", "5"],
    ],
    or8,
    0,
  );
  // orcc
  addInstructions2Operand("orcc", [[0x1d, "cc", "immediate", "3"]], orcc, 0);
}
