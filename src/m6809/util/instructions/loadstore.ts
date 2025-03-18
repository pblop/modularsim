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
  queryWrite,
} from "../instructions.js";
import type { CpuInfo, StateInfo } from "../state_machine";

function ld<M extends GeneralAddressingMode>(
  reg: Accumulator | Register,
  mode: M,
  cpu: Cpu,
  cpuInfo: CpuInfo,
  stateInfo: ExecuteStateInfo,
  addr: CpuAddressingData<M>,
  regs: Registers,
) {
  const size = REGISTER_SIZE[reg];

  const val = retrieveReadAddressing(addr, cpuInfo, stateInfo);
  if (val === null) return false;
  regs[reg] = val;

  updateConditionCodes(regs, {
    N: val & (size === 1 ? 0x80 : 0x8000),
    Z: val === 0,
    V: 0,
  });

  return true;
}

function st<M extends "direct" | "indexed" | "extended">(
  reg: Accumulator | Register,
  mode: M,
  cpu: Cpu,
  { memoryPending }: CpuInfo,
  stateInfo: ExecuteStateInfo,
  addr: CpuAddressingData<M>,
  regs: Registers,
): boolean {
  if (memoryPending) return false;

  const size = REGISTER_SIZE[reg];
  const val = regs[reg];

  updateConditionCodes(regs, {
    N: isNegative(val, size * 8),
    Z: val === 0,
    V: 0,
  });

  return true;
}

function clracc(stateInfo: ExecuteStateInfo, reg: Accumulator, regs: Registers): boolean {
  regs[reg] = 0;

  // Clear N,V,C, set Z
  regs.cc &= ~(ConditionCodes.OVERFLOW | ConditionCodes.CARRY | ConditionCodes.NEGATIVE);
  regs.cc |= ConditionCodes.ZERO;

  return true;
}
function clrmempart1(
  cpu: Cpu,
  cpuInfo: CpuInfo,
  stateInfo: ExecuteStateInfo,
  addr: CpuAddressingData<"direct" | "indexed" | "extended">,
  ____: Registers,
) {
  if (!stateInfo.ctx.instructionCtx.hasRead) {
    return queryReadAddressing(1, addr, cpuInfo, stateInfo);
  } else {
    return queryWrite(1, 0, addr, cpuInfo, stateInfo);
  }
}
function clrmem(
  { registers, memoryPending }: CpuInfo,
  { ctx: { instructionCtx } }: ExecuteStateInfo,
  addr: CpuAddressingData<"direct" | "indexed" | "extended">,
): boolean {
  if (memoryPending) return false;

  // We need to perform a memory read, ignore the value, and then perform
  // a memory write, and then, we're done.
  if (!instructionCtx.hasRead) {
    instructionCtx.hasRead = true;
    return false;
  }

  updateConditionCodes(registers, {
    N: 0,
    Z: 1,
    V: 0,
  });

  return true;
}

export default function (addInstructions: typeof addInstructionsType) {
  // clr(accumulator)
  addInstructions(
    "clr{register}",
    [
      [0x4f, "A", "inherent", "1"],
      [0x5f, "B", "inherent", "1"],
    ],
    (_, reg, mode, cycles) => (_, __, stateInfo, ____, regs) => clracc(stateInfo, reg, regs),
  );
  addInstructions(
    "clr",
    [
      [0x0f, undefined, "direct", "6"],
      [0x1f, undefined, "indexed", "6+"],
      [0x2f, undefined, "extended", "7"],
    ],
    (_, __, ___, ____) => ({
      start: clrmempart1,
      end: (_, cpuInfo, stateInfo, addr, ___) => clrmem(cpuInfo, stateInfo, addr),
    }),
  );

  // ld8 (lda, ldb) and ld16 (ldd, lds, ldu, ldx, ldy)
  addInstructions(
    "ld{register}",
    [
      [0x86, "A", "immediate", "2"],
      [0x96, "A", "direct", "4"],
      [0xa6, "A", "indexed", "4+"],
      [0xb6, "A", "extended", "5"],
      [0xc6, "B", "immediate", "2"],
      [0xd6, "B", "direct", "4"],
      [0xe6, "B", "indexed", "4+"],
      [0xf6, "B", "extended", "5"],

      [0xcc, "D", "immediate", "3"],
      [0x10ce, "S", "immediate", "4"],
      [0xce, "U", "immediate", "3"],
      [0x8e, "X", "immediate", "3"],
      [0x108e, "Y", "immediate", "4"],

      [0xdc, "D", "direct", "5"],
      [0x10de, "S", "direct", "6"],
      [0xde, "U", "direct", "5"],
      [0x9e, "X", "direct", "5"],
      [0x109e, "Y", "direct", "6"],

      [0xec, "D", "indexed", "5+"],
      [0x10ee, "S", "indexed", "6+"],
      [0xee, "U", "indexed", "5+"],
      [0xae, "X", "indexed", "5+"],
      [0x10ae, "Y", "indexed", "6+"],

      [0xfc, "D", "extended", "6"],
      [0x10fe, "S", "extended", "7"],
      [0xfe, "U", "extended", "6"],
      [0xbe, "X", "extended", "6"],
      [0x10be, "Y", "extended", "7"],
    ],
    (_, reg, mode, cycles) => ({
      start: (cpu, cpuInfo, stateInfo, addr, regs) =>
        queryReadAddressing(REGISTER_SIZE[reg], addr, cpuInfo, stateInfo),
      end: (cpu, cpuInfo, stateInfo, addr, regs) =>
        ld(reg, mode, cpu, cpuInfo, stateInfo, addr, regs),
    }),
  );
  // st8 (sta, stb) and st16 (std, sts, stu, stx, sty)
  addInstructions(
    "st{register}",
    [
      [0x97, "A", "direct", "4"],
      [0xa7, "A", "indexed", "4+"],
      [0xb7, "A", "extended", "5"],
      [0xd7, "B", "direct", "4"],
      [0xe7, "B", "indexed", "4+"],
      [0xf7, "B", "extended", "5"],

      [0xdd, "D", "direct", "5"],
      [0x10df, "S", "direct", "6"],
      [0xdf, "U", "direct", "5"],
      [0x9f, "X", "direct", "5"],
      [0x109f, "Y", "direct", "6"],

      [0xed, "D", "indexed", "5+"],
      [0x10ef, "S", "indexed", "6+"],
      [0xef, "U", "indexed", "5+"],
      [0xaf, "X", "indexed", "5+"],
      [0x10af, "Y", "indexed", "6+"],

      [0xfd, "D", "extended", "6"],
      [0x10ff, "S", "extended", "7"],
      [0xff, "U", "extended", "6"],
      [0xbf, "X", "extended", "6"],
      [0x10bf, "Y", "extended", "7"],
    ],
    (_, reg, mode, cycles) => ({
      start: (cpu, cpuInfo, stateInfo, addr, regs) =>
        queryWrite(REGISTER_SIZE[reg], regs[reg], addr, cpuInfo, stateInfo),
      end: (cpu, cpuInfo, stateInfo, addr, regs) =>
        st(reg, mode, cpu, cpuInfo, stateInfo, addr, regs),
    }),
  );
}
