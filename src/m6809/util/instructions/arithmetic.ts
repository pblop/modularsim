import {
  indexBit,
  isNegative,
  signExtend,
  truncate,
  twosComplement,
} from "../../../general/numbers.js";
import type Cpu from "../../hardware/cpu.js";
import type { CpuAddressingData } from "../../hardware/cpu.js";
import { ConditionCodes, REGISTER_SIZE, ShortCCNames, type Registers } from "../cpu_parts.js";
import {
  type ExecuteStateInfo,
  type TwoOpInstructionFunction,
  addInstructions2Operand,
  type addInstructions as addInstructionsType,
  updateConditionCodes,
} from "../instructions.js";
import type { CpuInfo } from "../state_machine.js";

function add(withCarry: boolean): TwoOpInstructionFunction {
  return (a: number, b: number, bits: number, regs: Registers) => {
    const carryIn = withCarry && regs.cc & ConditionCodes.CARRY ? 1 : 0;

    const untruncated = a + b + carryIn;
    const result = truncate(untruncated, bits);

    // Check if the bit after the last bit is set.
    const carryOut = (untruncated >> 1) & (1 << (bits - 1));

    // carries contains the bits that have been carried into.
    // that means that the 4th bit is set if the half carry has been set, the
    // 7th bit is set if overflow happened, and the 8th bit is set if
    // the carry has been set.

    const carries = a ^ b ^ result ^ carryOut;
    const H = bits === 16 ? undefined : carries & (1 << (bits / 2));

    // CC: H, N, Z, V, C
    return [
      result,
      {
        H,
        N: isNegative(result, bits),
        Z: result === 0,
        C: carryOut,
        V: carries & (1 << (bits - 1)),
      },
    ];
  };
}

function abx(cpuInfo: CpuInfo, stateInfo: ExecuteStateInfo) {
  const { ticksOnState } = stateInfo;
  const { registers } = cpuInfo;

  if (ticksOnState === 2) {
    registers.X = truncate(registers.X + registers.B, 16);
    return true;
  }

  return false;
}

function mul({ registers }: CpuInfo, { ticksOnState }: ExecuteStateInfo) {
  if (ticksOnState === 10) {
    registers.D = truncate(registers.A * registers.B, 16);
    updateConditionCodes(registers, {
      Z: registers.D === 0,
      C: indexBit(registers.B, 7),
    });
    return true;
  }
  return false;
}

function sex({ registers }: CpuInfo, _: ExecuteStateInfo) {
  registers.D = signExtend(registers.D, 8, 16);
  return true;
}

function sub(withCarry: boolean): TwoOpInstructionFunction {
  return (a: number, b: number, bits: number, regs: Registers) => {
    const carryIn = withCarry && regs.cc & ConditionCodes.CARRY ? 1 : 0;

    const negB = twosComplement(b, bits);
    const negCarryIn = twosComplement(carryIn, bits);
    const untruncated = a + negB + negCarryIn;
    const result = truncate(untruncated, bits);

    // CC: ??H, N, Z, V, C
    return [
      result,
      {
        // H is undefined for sub8, not set for sub16. So I just... don't set it.
        N: isNegative(result, bits),
        Z: result === 0,
        // I tried to calculate the carry flag by using the same logic as in the
        // add function (but using the negB val), but couldn't get it to work :(
        C: b + carryIn >= a,
        // I calculate the overflow flag following the logic explained here:
        // https://www.righto.com/2012/12/the-6502-overflow-flag-explained.html
        V: (a ^ result) & (negB ^ result) & (1 << (bits - 1)),
      },
    ];
  };
}

export default function (addInstructions: typeof addInstructionsType) {
  // add8 (adda, addb) and add16 (addd)
  addInstructions2Operand(
    "add{register}",
    [
      [0x8b, "A", "immediate", "2"],
      [0x9b, "A", "direct", "4"],
      [0xab, "A", "indexed", "4+"],
      [0xbb, "A", "extended", "5"],
      [0xcb, "B", "immediate", "2"],
      [0xdb, "B", "direct", "4"],
      [0xeb, "B", "indexed", "4+"],
      [0xfb, "B", "extended", "5"],
      [0xc3, "D", "immediate", "4"],
      [0xd3, "D", "direct", "6"],
      [0xe3, "D", "indexed", "6+"],
      [0xf3, "D", "extended", "7"],
    ],
    add(false),
    (reg) => (reg === "D" ? 2 : 0),
  );

  // adc8 (adca, adcb)
  addInstructions2Operand(
    "adc{register}",
    [
      [0x89, "A", "immediate", "2"],
      [0x99, "A", "direct", "4"],
      [0xa9, "A", "indexed", "4+"],
      [0xb9, "A", "extended", "5"],
      [0xc9, "B", "immediate", "2"],
      [0xd9, "B", "direct", "4"],
      [0xe9, "B", "indexed", "4+"],
      [0xf9, "B", "extended", "5"],
    ],
    add(true),
    0,
  );

  // abx
  addInstructions(
    "abx",
    [[0x3a, "X", "inherent", "3"]],
    (_, __, ___, ____) => (_, cpuInfo, stateInfo, __, ___) => abx(cpuInfo, stateInfo),
  );

  // mul
  addInstructions(
    "mul",
    [[0x3d, "D", "inherent", "4"]],
    (_, __, ___, ____) => (_, cpuInfo, stateInfo, __, ___) => mul(cpuInfo, stateInfo),
  );

  // sex
  addInstructions(
    "sex",
    [[0x1d, "D", "inherent", "2"]],
    (_, __, ___, ____) => (_, cpuInfo, stateInfo, __, ___) => sex(cpuInfo, stateInfo),
  );

  // sub8 (suba, subb) and sub16 (subd)
  addInstructions2Operand(
    "sub{register}",
    [
      [0x80, "A", "immediate", "2"],
      [0x90, "A", "direct", "4"],
      [0xa0, "A", "indexed", "4+"],
      [0xb0, "A", "extended", "5"],
      [0xc0, "B", "immediate", "2"],
      [0xd0, "B", "direct", "4"],
      [0xe0, "B", "indexed", "4+"],
      [0xf0, "B", "extended", "5"],
      [0x83, "D", "immediate", "4"],
      [0x93, "D", "direct", "6"],
      [0xa3, "D", "indexed", "6+"],
      [0xb3, "D", "extended", "7"],
    ],
    sub(false),
    (reg) => (reg === "D" ? 2 : 0),
  );

  // sbc8 (sbca, sbcb)
  addInstructions2Operand(
    "sbc{register}",
    [
      [0x82, "A", "immediate", "2"],
      [0x92, "A", "direct", "4"],
      [0xa2, "A", "indexed", "4+"],
      [0xb2, "A", "extended", "5"],
      [0xc2, "B", "immediate", "2"],
      [0xd2, "B", "direct", "4"],
      [0xe2, "B", "indexed", "4+"],
      [0xf2, "B", "extended", "5"],
    ],
    sub(true),
    0,
  );
}
