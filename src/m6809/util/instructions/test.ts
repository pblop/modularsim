import { isNegative, truncate, twosComplement } from "../../../general/numbers.js";
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

function cmp<M extends GeneralAddressingMode>(
  reg: Register | Accumulator,
  mode: M,
  cpu: Cpu,
  cpuInfo: CpuInfo,
  stateInfo: ExecuteStateInfo,
  addr: CpuAddressingData<M>,
  regs: Registers,
) {
  // The size of the register (in bytes).
  const size = REGISTER_SIZE[reg];
  const { ticksOnState, ctx } = stateInfo;

  if (ticksOnState === 0) {
    // cmp16 takes 1 cycle to do internal calculations, after the read.
    ctx.instructionCtx.remainingCycles = size === 2 ? 1 : 0;
  }

  const M = retrieveReadAddressing(addr, cpuInfo, stateInfo);
  if (M === null) return false;

  // the remaining cycles are for the cmp16 operation.
  if (ctx.instructionCtx.remainingCycles !== 0) {
    ctx.instructionCtx.remainingCycles--;
    return false;
  }

  const a = regs[reg];
  const negM = twosComplement(M, size * 8);
  const untruncated = a + negM;
  const result = truncate(untruncated, size * 8);

  if (size === 1) {
    // 8-bit
    // CC: N, Z, V, C
    updateConditionCodes(regs, {
      /* TODO: The effect on the Half-Carry flag is undefined for cmp8 */
      N: isNegative(result, size * 8),
      Z: result === 0,
      V: truncate(a, 7) + truncate(negM, 7) > 0x7f,
      C: untruncated > 0xff,
    });
  } else {
    // 16-bit
    // CC: N, Z, V, C
    updateConditionCodes(regs, {
      N: isNegative(result, size * 8),
      Z: result === 0,
      C: untruncated > 0xffff,
      V: truncate(a, 15) + truncate(negM, 15) > 0x7fff,
    });
  }

  return true;
}

export default function (addInstructions: typeof addInstructionsType) {
  addInstructions(
    "cmp{register}",
    [
      [0x81, "A", "immediate", "2"],
      [0x91, "A", "direct", "4"],
      [0xa1, "A", "indexed", "4+"],
      [0xb1, "A", "extended", "5"],
      [0xc1, "B", "immediate", "2"],
      [0xd1, "B", "direct", "4"],
      [0xe1, "B", "indexed", "4+"],
      [0xf1, "B", "extended", "5"],
      [0x1083, "D", "immediate", "3"],
      [0x1093, "D", "direct", "7"],
      [0x10a3, "D", "indexed", "7+"],
      [0x10b3, "D", "extended", "8"],
      [0x118c, "S", "immediate", "3"],
      [0x119c, "S", "direct", "7"],
      [0x11ac, "S", "indexed", "7+"],
      [0x11bc, "S", "extended", "8"],
      [0x1183, "U", "immediate", "5"],
      [0x1193, "U", "direct", "7"],
      [0x11a3, "U", "indexed", "7+"],
      [0x11b3, "U", "extended", "8"],
      [0x8c, "X", "immediate", "4"],
      [0x9c, "X", "direct", "6"],
      [0xac, "X", "indexed", "6+"],
      [0xbc, "X", "extended", "7"],
      [0x108c, "Y", "immediate", "5"],
      [0x109c, "Y", "direct", "7"],
      [0x10ac, "Y", "indexed", "7+"],
      [0x10bc, "Y", "extended", "8"],
    ],
    (_, reg, mode, cycles) => ({
      start: (cpu, cpuInfo, stateInfo, addr, regs) =>
        queryReadAddressing(REGISTER_SIZE[reg], addr, cpuInfo, stateInfo),
      end: (cpu, cpuInfo, stateInfo, addr, regs) =>
        cmp(reg, mode, cpu, cpuInfo, stateInfo, addr, regs),
    }),
  );
}
