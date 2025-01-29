import type Cpu from "../hardware/cpu.js";
import type { CpuAddressingData, CpuRelativeAddressingData } from "../hardware/cpu.js";
import type { CpuInfo, StateInfo } from "./state_machine.js";
import { ConditionCodes, type Registers } from "../util/cpu_parts.js";
import { signExtend, truncate } from "./numbers.js";

type ExecuteStateInfo = StateInfo<"execute">;

// A function that takes a CPU and an address, performs some operation, and
// returns the number of cycles the processor should wait.
// This is also typed to specify what address will be passed to the function
// given a certain addressing mode.
type InstructionLogic<M extends AddressingMode = AddressingMode> = (
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

function getValueFromMemory(
  bytes: number,
  cpu: Cpu,
  readPending: boolean,
  ticksOnState: number,
  addr: CpuAddressingData<GeneralAddressingMode>,
): number | null {
  if (readPending) return null;

  if (addr.mode === "immediate") {
    return addr.value;
  } else {
    if (ticksOnState === 0) {
      // We need to fetch the value from memory.
      cpu.queryMemory(addr.address, bytes);
      return null;
    } else {
      return cpu.readInfo!.value;
    }
  }
}

function writeValueToMemory(
  bytes: number,
  cpu: Cpu,
  writePending: boolean,
  ticksOnState: number,
  addr: CpuAddressingData<"direct" | "indexed" | "extended">,
  value: number,
): boolean {
  if (writePending) return false;

  if (ticksOnState === 0) {
    // We need to write the value to memory.
    cpu.queryMemoryWrite(addr.address, bytes, value);
    return false;
  } else {
    return true;
  }
}

function ld8<M extends GeneralAddressingMode>(
  reg: Accumulator,
  mode: M,
  cpu: Cpu,
  { readPending }: CpuInfo,
  { ticksOnState, ctx }: ExecuteStateInfo,
  addr: CpuAddressingData<M>,
  regs: Registers,
) {
  const val = getValueFromMemory(1, cpu, readPending, ticksOnState, addr);
  if (val === null) return false;

  regs[reg] = val;

  // Clear V flag, set N if negative, Z if zero
  regs.cc &= ~(ConditionCodes.OVERFLOW | ConditionCodes.ZERO | ConditionCodes.NEGATIVE);
  regs.cc |= val === 0 ? ConditionCodes.ZERO : 0;
  regs.cc |= val & 0x80 ? ConditionCodes.NEGATIVE : 0;

  return true;
}

function ld16<M extends GeneralAddressingMode>(
  reg: Register,
  mode: M,
  cpu: Cpu,
  { readPending }: CpuInfo,
  { ticksOnState, ctx }: ExecuteStateInfo,
  addr: CpuAddressingData<M>,
  regs: Registers,
) {
  const val = getValueFromMemory(2, cpu, readPending, ticksOnState, addr);
  if (val === null) return false;

  regs[reg] = val;

  // Clear V flag, set N if negative, Z if zero
  regs.cc &= ~(ConditionCodes.OVERFLOW | ConditionCodes.ZERO | ConditionCodes.NEGATIVE);
  regs.cc |= val === 0 ? ConditionCodes.ZERO : 0;
  regs.cc |= val & 0x8000 ? ConditionCodes.NEGATIVE : 0;

  return true;
}

function branching<M extends "relative">(
  cpu: Cpu,
  mnemonic: string,
  { readPending }: CpuInfo,
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

function st8<M extends "direct" | "indexed" | "extended">(
  reg: Accumulator,
  mode: M,
  cpu: Cpu,
  { writePending }: CpuInfo,
  { ticksOnState, ctx }: ExecuteStateInfo,
  addr: CpuAddressingData<M>,
  regs: Registers,
): boolean {
  const val = regs[reg];
  if (!writeValueToMemory(1, cpu, writePending, ticksOnState, addr, val)) return false;

  // Clear V flag, set N if negative, Z if zero
  cpu.registers.cc &= ~(ConditionCodes.OVERFLOW | ConditionCodes.ZERO | ConditionCodes.NEGATIVE);
  cpu.registers.cc |= val === 0 ? ConditionCodes.ZERO : 0;
  cpu.registers.cc |= val & 0x80 ? ConditionCodes.NEGATIVE : 0;

  return true;
}

function clracc(reg: Accumulator, regs: Registers): boolean {
  regs[reg] = 0;

  // Clear N,V,C, set Z
  regs.cc &= ~(ConditionCodes.OVERFLOW | ConditionCodes.CARRY | ConditionCodes.NEGATIVE);
  regs.cc |= ConditionCodes.ZERO;

  return true;
}

export type InstructionData<T extends AddressingMode = AddressingMode> = {
  mnemonic: string;
  cycles: string;
  register: Accumulator | Register | "pc";
  mode: T;
  function: InstructionLogic<T>;
};
export const INSTRUCTIONS: Record<number, InstructionData> = {};
/**
 * Helper function to add instructions to the INSTRUCTIONS object in a more readable way.
 * @param mnemonic The mnemonic of the instruction (a '{register}' will be replaced with the register name).
 * @param modes An array of [opcode, register, addressing mode, cycles] tuples.
 * @param logic A function that, given the register, mode, and cycles, returns the instruction logic (useful
 * for instructions that have the same logic but different modes).
 */
function addInstructions<R extends Accumulator | Register | "pc", M extends AddressingMode>(
  mnemonic: string,
  modes: [number, R, M, string][], // [opcode, register, addressing mode, cycles]
  logic: (register: R, mode: M, cycles: string) => InstructionLogic<M>,
) {
  for (const [opcode, register, mode, cycles] of modes) {
    const replaced = mnemonic.replace("{register}", register.toLowerCase());

    INSTRUCTIONS[opcode] = {
      mnemonic: replaced,
      register,
      mode,
      cycles,
      function: logic(register, mode, cycles),
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
    [0x4f, "A", "inherent", "3/1"],
    [0x5f, "B", "inherent", "3/1"],
  ],
  (reg, mode, cycles) => (_, __, ___, ____, regs) => clracc(reg, regs),
);

// ld16 (ldx, ...)
addInstructions(
  "ld{register}",
  [
    [0xcc, "D", "immediate", "3"],
    [0x10ce, "S", "immediate", "4"],
    [0xce, "U", "immediate", "3"],
    [0x8e, "X", "immediate", "3"],
    [0x108e, "Y", "immediate", "4"],

    [0xdc, "D", "direct", "5/4"],
    [0x10de, "S", "direct", "6/5"],
    [0xde, "U", "direct", "5/4"],
    [0x9e, "X", "direct", "5/4"],
    [0x109e, "Y", "direct", "6/5"],

    [0xec, "D", "indexed", "5+"],
    [0x10ee, "S", "indexed", "6+"],
    [0xee, "U", "indexed", "5+"],
    [0xae, "X", "indexed", "5+"],
    [0x10ae, "Y", "indexed", "6+"],

    [0xfc, "D", "extended", "6/5"],
    [0x10fe, "S", "extended", "7/6"],
    [0xfe, "U", "extended", "6/5"],
    [0xbe, "X", "extended", "6/5"],
    [0x10be, "Y", "extended", "7/6"],
  ],
  (reg, mode, cycles) => (cpu, cpuInfo, stateInfo, addr, regs) =>
    ld16(reg, mode, cpu, cpuInfo, stateInfo, addr, regs),
);
// ld8 (lda, ldb)
addInstructions(
  "ld{register}",
  [
    [0x86, "A", "immediate", "2"],
    [0x96, "A", "direct", "4/3"],
    [0xa6, "A", "indexed", "4+"],
    [0xb6, "A", "extended", "5/4"],
    [0xc6, "B", "immediate", "2"],
    [0xd6, "B", "direct", "4/3"],
    [0xe6, "B", "indexed", "4+"],
    [0xf6, "B", "extended", "5/4"],
  ],
  (reg, mode, cycles) => (cpu, cpuInfo, stateInfo, addr, regs) =>
    ld8(reg, mode, cpu, cpuInfo, stateInfo, addr, regs),
);
// st8 (sta, stb)
addInstructions(
  "st{register}",
  [
    [0x97, "A", "direct", "4/3"],
    [0xa7, "A", "indexed", "4+"],
    [0xb7, "A", "extended", "5/4"],
    [0xd7, "B", "direct", "4/3"],
    [0xe7, "B", "indexed", "4+"],
    [0xf7, "B", "extended", "5/4"],
  ],
  (reg, mode, cycles) => (cpu, cpuInfo, stateInfo, addr, regs) =>
    st8(reg, mode, cpu, cpuInfo, stateInfo, addr, regs),
);

export function performInstructionLogic<M extends AddressingMode>(
  cpu: Cpu,
  cpuInfo: CpuInfo,
  // This is being executed in the execute state (we can safely modify the context, it is ours!).
  stateInfo: ExecuteStateInfo,
  data: InstructionData<M>,
  addressing: CpuAddressingData<M>,
  registers: Registers,
): boolean {
  return data.function(cpu, cpuInfo, stateInfo, addressing, registers);
}
