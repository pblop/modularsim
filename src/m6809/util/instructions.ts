import type Cpu from "../hardware/cpu.js";
import type { CpuAddressingData, CpuRelativeAddressingData } from "../hardware/cpu.js";
import type { CpuInfo, StateInfo } from "./state_machine.js";
import { ConditionCodes, REGISTER_SIZE, type Registers } from "../util/cpu_parts.js";
import { isNegative, signExtend, truncate } from "../../general/numbers.js";
import M6809Simulator from "../base.js";

type ExecuteStateInfo = StateInfo<"execute">;

// A function that takes a CPU and an address, performs some operation, and
// returns the number of cycles the processor should wait.
// This is also typed to specify what address will be passed to the function
// given a certain addressing mode.
type InstructionStartFn<M extends AddressingMode = AddressingMode> = (
  cpu: Cpu,
  cpuInfo: CpuInfo,
  stateInfo: ExecuteStateInfo,
  addressingData: CpuAddressingData<M>,
  registers: Registers,
) => void;
type InstructionEndFn<M extends AddressingMode = AddressingMode> = (
  cpu: Cpu,
  cpuInfo: CpuInfo,
  stateInfo: ExecuteStateInfo,
  addressingData: CpuAddressingData<M>,
  registers: Registers,
) => boolean;

export type AddressingMode = AddressableAddressingMode | "inherent";
type GeneralAddressingMode = "immediate" | "direct" | "indexed" | "extended";
export type AddressableAddressingMode =
  | "immediate"
  | "direct"
  | "indexed"
  | "extended"
  | "relative";
export type Register = "D" | "X" | "Y" | "U" | "S";
export type Accumulator = "A" | "B";

// The enum values are _not_ important here.
// biome-ignore lint/style/useEnumInitializers: <above>
export enum IndexedAction {
  Offset0,
  Offset5,
  Offset8,
  Offset16,
  OffsetA,
  OffsetB,
  OffsetD,
  PostInc1,
  PostInc2,
  PreDec1,
  PreDec2,
  OffsetPC8,
  OffsetPC16,
  ExtendedIndirect,
}
export type ParsedIndexedPostbyte<A extends IndexedAction = IndexedAction> = {
  action: A;
  register: A extends IndexedAction.OffsetPC8 | IndexedAction.OffsetPC16 ? "pc" : Register;
  indirect: boolean;
  rest: number; // 4-bit integer
};
export function parseIndexedPostbyte(postbyte: number): ParsedIndexedPostbyte | null {
  const fivebit = !((postbyte & 0x80) >> 7);
  const indirect = (postbyte & 0x10) >> 4;
  const RR = (postbyte & 0x60) >> 5; // 00 = X, 01 = Y, 10 = U, 11 = S

  const rest = postbyte & 0xf;

  // Get the register to use (given by RR in all but 4 cases).
  let register: Register | "pc";
  if (rest === 0b1100 || rest === 0b1101)
    // 8 or 16 bit offset from PC
    register = "pc";
  else register = ["X", "Y", "U", "S"][RR] as Register;

  let action: IndexedAction | undefined;
  if (fivebit) {
    action = IndexedAction.Offset5;
  } else {
    action = {
      0b0100: IndexedAction.Offset0,
      0b1000: IndexedAction.Offset8,
      0b1001: IndexedAction.Offset16,
      0b0110: IndexedAction.OffsetA,
      0b0101: IndexedAction.OffsetB,
      0b1011: IndexedAction.OffsetD,
      0b0000: IndexedAction.PostInc1,
      0b0001: IndexedAction.PostInc2,
      0b0010: IndexedAction.PreDec1,
      0b0011: IndexedAction.PreDec2,
      0b1100: IndexedAction.OffsetPC8,
      0b1101: IndexedAction.OffsetPC16,
      0b1111: IndexedAction.ExtendedIndirect,
    }[rest];
  }

  // Fail if we haven't found an action.
  if (action === undefined) return null;

  return {
    action,
    register,
    indirect: !!indirect, // coerce to boolean
    rest,
  };
}
export type FetchableAddress = number | "pc";

/**
 * Query the memory for a value and store it in the instruction context. This is
 * made to be used in the start function of instructions that need to read a value
 * from memory.
 * @param size The size of the value to read (in bytes).
 * @param addr The addressing data to read from.
 * @param cpuInfo The CPU information.
 * @param stateInfo The state information.
 */
function queryReadAddressing(
  bytes: number,
  addr: CpuAddressingData<GeneralAddressingMode>,
  { queryMemoryRead, memoryAction, memoryPending }: CpuInfo,
  { ticksOnState, ctx: { instructionCtx } }: ExecuteStateInfo,
) {
  if (ticksOnState === 0) {
    let address: number | "pc";
    if (addr.mode === "immediate") address = "pc";
    else address = addr.address;
    // We need to fetch the value from memory.
    queryMemoryRead(address, bytes);
    instructionCtx.memory = null;
  }
}
function retrieveReadAddressing(
  addr: CpuAddressingData<GeneralAddressingMode>,
  { memoryAction, memoryPending }: CpuInfo,
  { ctx: { instructionCtx } }: ExecuteStateInfo,
): number | null {
  if (memoryPending) return null;
  else return memoryAction!.valueRead;
}

/**
 * Query the memory to write a value. This is made to be used in the start function
 * of instructions that need to write a value to memory.
 * @param bytes The size of the value to write (in bytes).
 * @param value The value to write.
 * @returns Whether the memory has been fully written to.
 */
function queryWrite(
  size: number,
  value: number,
  addr: CpuAddressingData<"direct" | "indexed" | "extended">,
  { queryMemoryWrite, memoryAction, memoryPending }: CpuInfo,
  { ticksOnState, ctx: { instructionCtx } }: ExecuteStateInfo,
): boolean {
  if (instructionCtx.written === true) return true;
  instructionCtx.written = false;
  if (memoryPending) return false;

  if (ticksOnState === 0) {
    // We need to write the value to memory.
    queryMemoryWrite(addr.address, size, value);
    instructionCtx.written = false;
    return false;
  } else {
    instructionCtx.written = true;
    return true;
  }
}

type ShortCCNames = "E" | "F" | "H" | "I" | "N" | "Z" | "V" | "C";
const SHORT_CC_NAME_MAP: Record<ShortCCNames, ConditionCodes> = {
  E: ConditionCodes.ENTIRE_FLAG,
  F: ConditionCodes.FIRQ_MASK,
  H: ConditionCodes.HALF_CARRY,
  I: ConditionCodes.IRQ_MASK,
  N: ConditionCodes.NEGATIVE,
  Z: ConditionCodes.ZERO,
  V: ConditionCodes.OVERFLOW,
  C: ConditionCodes.CARRY,
};
function updateConditionCodes(regs: Registers, ccs: { [K in ShortCCNames]?: boolean | number }) {
  for (const [cc, value] of Object.entries(ccs)) {
    if (value) regs.cc |= SHORT_CC_NAME_MAP[cc as ShortCCNames];
    else regs.cc &= ~SHORT_CC_NAME_MAP[cc as ShortCCNames];
  }
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

function branching<M extends "relative">(
  cpu: Cpu,
  mnemonic: string,
  { memoryPending }: CpuInfo,
  { ticksOnState, ctx: { instructionCtx } }: ExecuteStateInfo,
  addr: CpuAddressingData<M>,
  regs: Registers,
  condition: (cc: number) => boolean | number,
): boolean {
  if (instructionCtx.branchTaken === undefined) {
    instructionCtx.branchTaken = condition(regs.cc);
  }
  // Long Branch instructions take 0 extra cycles if the branch is not taken.
  if (!instructionCtx.branchTaken && addr.long) return true;

  // The rest of the instructions take 1 extra cycle: long branches if taken, short branches always.
  if (ticksOnState === 0) return false;

  if (instructionCtx.branchTaken) {
    if (mnemonic === "bsr" || mnemonic === "lbsr") {
      console.error("BSR/LBSR not implemented");
    }
    regs.pc = addr.address;
  }

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

/**
 * Information about an instruction, including its mnemonic, cycles, register, and addressing mode.
 * Additional information includes:
 * - readAddressing: whether the instruction reads from the memory region specified by the
 *    addressing mode (e.g., `ld`, `add instructions do, `clr` instructions don't).
 */
export type InstructionData<T extends AddressingMode = AddressingMode> = {
  mnemonic: string;
  cycles: string;
  register: Accumulator | Register | "pc";
  mode: T;
  start?: InstructionStartFn<T>;
  end?: InstructionEndFn<T>;
};
export const INSTRUCTIONS: Record<number, InstructionData> = {};
/**
 * Helper function to add instructions to the INSTRUCTIONS object in a more readable way.
 * @param mnemonic The mnemonic of the instruction (a '{register}' will be replaced with the register name).
 * @param modes An array of [opcode, register, addressing mode, cycles] tuples.
 * @param funGen A function that, given the register, mode, and cycles,
 * returns the instruction functions (useful for instructions that have
 * the same logic but different modes).
 * The function can return an object with `start` and `end` functions,
 * or just an `end` function.
 */
function addInstructions<R extends Accumulator | Register | "pc", M extends AddressingMode>(
  mnemonic: string,
  modes: [number, R, M, string][], // [opcode, register, addressing mode, cycles]
  funGen: (
    register: R,
    mode: M,
    cycles: string,
  ) => { start?: InstructionStartFn<M>; end?: InstructionEndFn<M> } | InstructionEndFn<M>,
) {
  for (const [opcode, register, mode, cycles] of modes) {
    const replaced = mnemonic.replace("{register}", register.toLowerCase());

    const fun = funGen(register, mode, cycles);
    INSTRUCTIONS[opcode] = {
      mnemonic: replaced,
      register,
      mode,
      cycles,
      start: typeof fun === "function" ? undefined : fun.start,
      end: typeof fun === "function" ? fun : fun.end,
    };
  }
}

addInstructions(
  "beq",
  [[0x27, "pc", "relative", "3"]],
  () => (cpu, cpuInfo, stateInfo, addressingData, registers) =>
    branching(
      cpu,
      "beq",
      cpuInfo,
      stateInfo,
      addressingData,
      registers,
      (cc) => cc & ConditionCodes.ZERO,
    ),
);
addInstructions(
  "bra",
  [[0x20, "pc", "relative", "3"]],
  () => (cpu, cpuInfo, stateInfo, addr, regs) =>
    branching(cpu, "bra", cpuInfo, stateInfo, addr, regs, () => true),
);

// clr(accumulator)
addInstructions(
  "clr{register}",
  [
    [0x4f, "A", "inherent", "1"],
    [0x5f, "B", "inherent", "1"],
  ],
  (reg, mode, cycles) => (_, __, stateInfo, ____, regs) => clracc(stateInfo, reg, regs),
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
  (reg, mode, cycles) => ({
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
  (reg, mode, cycles) => ({
    start: (cpu, cpuInfo, stateInfo, addr, regs) =>
      queryWrite(REGISTER_SIZE[reg], regs[reg], addr, cpuInfo, stateInfo),
    end: (cpu, cpuInfo, stateInfo, addr, regs) =>
      st(reg, mode, cpu, cpuInfo, stateInfo, addr, regs),
  }),
);

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
  (reg, mode, cycles) => ({
    start: (cpu, cpuInfo, stateInfo, addr, regs) =>
      queryReadAddressing(REGISTER_SIZE[reg], addr, cpuInfo, stateInfo),
    end: (cpu, cpuInfo, stateInfo, addr, regs) =>
      add(reg, mode, cpu, cpuInfo, stateInfo, addr, regs, false),
  }),
);
// adc8 (adca, adcb) and adc16 (adcd)
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
    [0x1089, "D", "immediate", "5"],
    [0x1099, "D", "direct", "7"],
    [0x10a9, "D", "indexed", "7+"],
    [0x10b9, "D", "extended", "8"],
  ],
  (reg, mode, cycles) => ({
    start: (cpu, cpuInfo, stateInfo, addr, regs) =>
      queryReadAddressing(REGISTER_SIZE[reg], addr, cpuInfo, stateInfo),
    end: (cpu, cpuInfo, stateInfo, addr, regs) =>
      add(reg, mode, cpu, cpuInfo, stateInfo, addr, regs, true),
  }),
);

export function performInstructionLogic<M extends AddressingMode>(
  part: "start" | "end",
  cpuInfo: CpuInfo,
  // This is being executed in the execute state (we can safely modify the context, it is ours!).
  stateInfo: ExecuteStateInfo,
  data: InstructionData<M>,
  addressing: CpuAddressingData<M>,
): boolean {
  if (part === "start" && data.start) {
    data.start(cpuInfo.cpu, cpuInfo, stateInfo, addressing, cpuInfo.registers);
    return true;
  } else if (part === "end" && data.end) {
    return data.end(cpuInfo.cpu, cpuInfo, stateInfo, addressing, cpuInfo.registers);
  } else {
    return true;
  }
}
