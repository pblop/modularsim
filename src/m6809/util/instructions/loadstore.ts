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

export type AllRegisters = Register | Accumulator | "pc" | "cc" | "dp";

// biome-ignore format: this is easier to read if not formatted
const REGISTER_LIST_EXG: (AllRegisters | null)[] = ["D", "X", "Y", "U", "S", 
  "pc", null, null, "A", "B", "cc", "dp"];
export function parseExgPostbyte(postbyte: number): [AllRegisters | null, AllRegisters | null] {
  const reg1i = (postbyte & 0xf0) >> 4;
  const reg2i = postbyte & 0x0f;

  const reg1: AllRegisters | null = REGISTER_LIST_EXG[reg1i];
  const reg2: AllRegisters | null = REGISTER_LIST_EXG[reg2i];

  return [reg1, reg2];
}

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

function exg(
  cpuInfo: CpuInfo,
  stateInfo: ExecuteStateInfo,
  addressingData: CpuAddressingData<"immediate">,
): boolean {
  const { registers } = cpuInfo;
  const {
    ticksOnState,
    ctx: { instructionCtx },
  } = stateInfo;

  // 1 tick on Instruction Fetch, 7 ticks on Execute
  if (ticksOnState !== 7) return false;

  const postbyte = retrieveReadAddressing(addressingData, cpuInfo, stateInfo);
  if (postbyte === null) return false;

  const [name1, name2] = parseExgPostbyte(postbyte);

  // NOTE: I perform the swap on the last cycle because I send events for every
  // PC change, and it seems most sensible (even if it's not the most accurate)
  // to send the event at the end of the instruction.

  // The Programmer's Reference I'm using says that:
  // > Program flow can be altered by specifying PC as one of the registers.
  // > When this occurs, the other register is set to the address of the
  // > instruction that follows EXG.
  // Given that, at this point, the PC is already pointing to the next
  // instruction, I just need to swap the registers around!

  // If the register is null (invalid register in the postbyte), a constant
  // value of FF or FFFF is used, depending on the size of the other register.
  if (name1 === null && name2 === null) {
    // TODO: what does the 6809 do in this case?
    console.error("Invalid EXG postbyte, both registers' encodings are invalid");
    return true;
  } else if (name1 === null || name2 === null) {
    console.error("Invalid EXG postbyte, one register's encoding is invalid");

    // TypeScript is a bit dumb here. Only one of the two can be null!
    const validName = (name1 ?? name2)!;
    registers[validName] = REGISTER_SIZE[validName] === 1 ? 0xff : 0xffff;

    return true;
  }

  const size1 = REGISTER_SIZE[name1];
  const size2 = REGISTER_SIZE[name2];

  if (size1 === size2) {
    const val1 = registers[name1];
    registers[name1] = registers[name2];
    registers[name2] = val1;
  } else {
    // When exchanging registers of different sizes, the 8-bit register is
    // exchanged with the low byte of the 16-bit register, and the high byte of
    // the 16-bit register is set to a value depending on some conditions (coded
    // below).

    // The case of A->D is special, because it's the same as A->B
    if (name1 === "A" && name2 === "D") {
      const A = registers.A;
      registers.A = registers.B;
      registers.B = A;
      return true;
    }

    // Now, for the general case:
    // The high byte is set to FF if:
    // - 16 -> 8 exchange and any 8-bit register is involved
    // - 8 -> 16 exchange and A or B is involved
    //             but not if A -> D (which is the same as A -> B)
    // Otherwise (when 8 -> 16 and CC or DP is involved), the high byte is set
    // to the value of the 8-bit register (that is, the big register is set to
    // the value of the small register on both bytes).
    const nameSmall = size1 === 1 ? name1 : name2;
    const nameBig = size1 === 2 ? name1 : name2;

    const valSmall = registers[nameSmall];
    const valBig = registers[nameBig];

    let highByte = 0;

    if ((size1 === 2 && size2 === 1) || name1 === "A" || name2 === "B") {
      highByte = 0xff;
    } else {
      highByte = valSmall;
    }

    // NOTE: This is not _very_ efficient, because in the case that B -> D, I'm
    // doing an extra operation that is not needed.
    registers[nameSmall] = truncate(valBig, 8);
    registers[nameBig] = (highByte << 8) | valSmall;
  }

  return true;
}

function tfr(
  cpuInfo: CpuInfo,
  stateInfo: ExecuteStateInfo,
  addressingData: CpuAddressingData<"immediate">,
): boolean {
  const { registers } = cpuInfo;
  const {
    ticksOnState,
    ctx: { instructionCtx },
  } = stateInfo;

  // 1 tick on Instruction Fetch, 5 ticks on Execute
  if (ticksOnState !== 5) return false;

  const postbyte = retrieveReadAddressing(addressingData, cpuInfo, stateInfo);
  if (postbyte === null) return false;

  const [name1, name2] = parseExgPostbyte(postbyte);

  if (name2 === null) return true;

  const size2 = REGISTER_SIZE[name2];
  const size1 = name1 == null ? size2 : REGISTER_SIZE[name1];
  const val1 = name1 == null ? (size1 === 1 ? 0xff : 0xffff) : registers[name1];

  if (size1 === size2) {
    registers[name2] = val1;
  } else {
    // If the two registers are of different sizes:
    if (size1 === 16 && size2 === 8) {
      // 16 -> 8, destination is LSB of source
      registers[name2] = truncate(val1, 8);
    } else {
      // 8 -> 16
      if (name1 === "A" || name1 === "B") {
        // if A or B, destination is MSB=ff, LSB=source
        registers[name2] = 0xff00 | val1;
      } else {
        // if CC or DP, destination is MSB=source, LSB=source
        registers[name2] = (val1 << 8) | val1;
      }
    }
  }

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
  // clr(mem)
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

  // exg
  addInstructions(
    "exg",
    [[0x1e, undefined, "immediate", "8"]],
    (_, __, ___, ____) => ({
      start: (cpu, cpuInfo, stateInfo, addr, regs) =>
        queryReadAddressing(1, addr, cpuInfo, stateInfo),
      end: (cpu, cpuInfo, stateInfo, addr, regs) => exg(cpuInfo, stateInfo, addr),
    }),
    { postbyte: true },
  );

  // tfr
  addInstructions(
    "tfr",
    [[0x1f, undefined, "immediate", "8"]],
    (_, __, ___, ____) => ({
      start: (cpu, cpuInfo, stateInfo, addr, regs) =>
        queryReadAddressing(1, addr, cpuInfo, stateInfo),
      end: (cpu, cpuInfo, stateInfo, addr, regs) => tfr(cpuInfo, stateInfo, addr),
    }),
    { postbyte: true },
  );
}
