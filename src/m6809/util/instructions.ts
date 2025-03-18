import type Cpu from "../hardware/cpu.js";
import type { CpuAddressingData, CpuRelativeAddressingData } from "../hardware/cpu.js";
import type { CpuInfo, StateInfo } from "./state_machine.js";
import { ConditionCodes, REGISTER_SIZE, type Registers } from "../util/cpu_parts.js";
import {
  indexBit,
  isNegative,
  signExtend,
  truncate,
  twosComplement,
} from "../../general/numbers.js";
import M6809Simulator from "../base.js";
import branching from "./instructions/branching.js";
import test from "./instructions/test.js";
import loadStore from "./instructions/loadstore.js";
import arithmetic from "./instructions/arithmetic.js";

export type ExecuteStateInfo = StateInfo<"execute">;

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
export type GeneralAddressingMode = "immediate" | "direct" | "indexed" | "extended";
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
export function queryReadAddressing(
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
export function retrieveReadAddressing(
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
export function queryWrite(
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
export function updateConditionCodes(
  regs: Registers,
  ccs: { [K in ShortCCNames]?: boolean | number },
) {
  for (const [cc, value] of Object.entries(ccs)) {
    if (value) regs.cc |= SHORT_CC_NAME_MAP[cc as ShortCCNames];
    else regs.cc &= ~SHORT_CC_NAME_MAP[cc as ShortCCNames];
  }
}

/**
 * Information about an instruction, including its mnemonic, cycles, register, and addressing mode.
 * Additional information includes:
 * - readAddressing: whether the instruction reads from the memory region specified by the
 *    addressing mode (e.g., `ld`, `add instructions do, `clr` instructions don't).
 */
export type ExtraInstructionData = {
  isLongBranch: boolean;
};
export type InstructionData<T extends AddressingMode = AddressingMode> = {
  mnemonic: string;
  cycles: string;
  register: Accumulator | Register | "pc" | (T extends "immediate" ? never : undefined);
  mode: T;
  start?: InstructionStartFn<T>;
  end?: InstructionEndFn<T>;
  extra: ExtraInstructionData;
};
export type FunGen<
  R extends Accumulator | Register | "pc" | (M extends "immediate" ? never : undefined),
  M extends AddressingMode,
> = (
  mnemonic: string,
  register: R,
  mode: M,
  cycles: string,
  extra: ExtraInstructionData,
) => { start?: InstructionStartFn<M>; end?: InstructionEndFn<M> } | InstructionEndFn<M>;
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
export function addInstructions<
  R extends Accumulator | Register | "pc" | (M extends "immediate" ? never : undefined),
  M extends AddressingMode,
>(
  mnemonicPattern: string,
  modes: [number, R, M, string][], // [opcode, register, addressing mode, cycles]
  funGen: FunGen<R, M>,
  extraIn?: ExtraInstructionData,
) {
  // Default extra information.
  const extra = { isLongBranch: false, ...extraIn };

  for (const [opcode, register, mode, cycles] of modes) {
    const mnemonic =
      register === undefined
        ? mnemonicPattern
        : mnemonicPattern.replace("{register}", register.toLowerCase());

    const fun = funGen(mnemonic, register, mode, cycles, extra);
    INSTRUCTIONS[opcode] = {
      mnemonic,
      register,
      mode,
      cycles,
      start: typeof fun === "function" ? undefined : fun.start,
      end: typeof fun === "function" ? fun : fun.end,
      extra,
    };
  }
}

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

// Add the instructions.
branching(addInstructions);
loadStore(addInstructions);
test(addInstructions);
arithmetic(addInstructions);
