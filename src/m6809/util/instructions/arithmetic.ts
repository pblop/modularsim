import { isNegative, truncate, twosComplement } from "../../../general/numbers.js";
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
} from "../instructions.js";
import type { CpuInfo, StateInfo } from "../state_machine";

function add<M extends GeneralAddressingMode>(
  reg: Register | Accumulator,
  mode: M,
  cpu: Cpu,
  cpuInfo: CpuInfo,
  stateInfo: ExecuteStateInfo,
  addr: CpuAddressingData<M>,
  regs: Registers,
  withCarry = false,
) {
  // The size of the register (in bytes).
  const size = REGISTER_SIZE[reg];
  const { ticksOnState, ctx } = stateInfo;

  if (ticksOnState === 0) {
    // add16 takes 1 cycle to do internal calculations, after the read.
    ctx.instructionCtx.remainingCycles = size === 2 ? 1 : 0;
  }

  const b = retrieveReadAddressing(addr, cpuInfo, stateInfo);
  if (b === null) return false;

  // the remaining cycles are for the add16 operation.
  if (ctx.instructionCtx.remainingCycles !== 0) {
    ctx.instructionCtx.remainingCycles--;
    return false;
  }

  const a = regs[reg];
  const carry = withCarry && regs.cc & ConditionCodes.CARRY ? 1 : 0;
  const untruncated = a + b + carry;
  const result = truncate(untruncated, size * 8);

  regs[reg] = result;

  if (size === 1) {
    // 8-bit
    // CC: H, N, Z, V, C
    updateConditionCodes(regs, {
      // For half-carry, we add the lower nibbles and check if the result is greater than 0xf.
      H: truncate(a, 4) + truncate(b, 4) > 0xf,
      N: isNegative(result, size * 8),
      Z: result === 0,
      // For carry, we check if the result "overflowed".
      C: untruncated > 0xff,
      // For carry, we add the bits up to 7 and check if the result overflowed.
      V: truncate(a, 7) + truncate(b, 7) > 0x7f,
    });
  } else {
    // 16-bit
    // CC: N, Z, V, C
    updateConditionCodes(regs, {
      // For half-carry, we add the lower nibbles and check if the result is greater than 0xf.
      N: isNegative(result, size * 8),
      Z: result === 0,
      // For carry, we check if the result "overflowed".
      C: untruncated > 0xffff,
      // For overflow, we add the bits up to 15 and check if the result overflowed.
      V: truncate(a, 15) + truncate(b, 15) > 0x7fff,
    });
  }

  return true;
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

export default function (addInstructions: typeof addInstructionsType) {
  // add8 (adda, addb) and add16 (addd)
  addInstructions(
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
    (_, reg, mode, cycles) => ({
      start: (cpu, cpuInfo, stateInfo, addr, regs) =>
        queryReadAddressing(REGISTER_SIZE[reg], addr, cpuInfo, stateInfo),
      end: (cpu, cpuInfo, stateInfo, addr, regs) =>
        add(reg, mode, cpu, cpuInfo, stateInfo, addr, regs, false),
    }),
  );
  // adc8 (adca, adcb)
  addInstructions(
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
    (_, reg, mode, cycles) => ({
      start: (cpu, cpuInfo, stateInfo, addr, regs) =>
        queryReadAddressing(REGISTER_SIZE[reg], addr, cpuInfo, stateInfo),
      end: (cpu, cpuInfo, stateInfo, addr, regs) =>
        add(reg, mode, cpu, cpuInfo, stateInfo, addr, regs, true),
    }),
  );

  // abx
  addInstructions(
    "abx",
    [[0x3a, "X", "inherent", "3"]],
    (_, __, ___, ____) => (_, cpuInfo, stateInfo, __, ___) => abx(cpuInfo, stateInfo),
  );
}
