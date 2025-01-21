import type Cpu from "../hardware/cpu.js";
import { ConditionCodes } from "../util/cpu_parts.js";
import { signExtend, truncate } from "./numbers.js";

// A function that takes a CPU and an address, performs some operation, and
// returns the number of cycles the processor should wait.
// This is also typed to specify what address will be passed to the function
// given a certain addressing mode.
type InstructionLogic<M extends AddressingMode = AddressingMode> = (
  cpu: Cpu,
  address: M extends "immediate" ? "pc" : M extends "inherent" ? null : number,
) => Promise<number>;

export type AddressingMode = AddressableAddressingMode | "inherent";
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
enum IndexedAction {
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
type ParsedIndexedPostbyte = {
  action: IndexedAction;
  register: Register | "pc";
  indirect: boolean;
  rest: number; // 4-bit integer
};
function parseIndexedPostbyte(postbyte: number): ParsedIndexedPostbyte | null {
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

async function indexedAddressing(cpu: Cpu, parsedPostbyte: ParsedIndexedPostbyte): Promise<number> {
  const { action, register, indirect, rest } = parsedPostbyte;

  let address: number = cpu.registers[register];
  switch (action) {
    case IndexedAction.Offset5: {
      // Non-Indirect, 5 bit offset
      const offset = signExtend(rest, 5, 16);
      address += offset;
      break;
    }
    case IndexedAction.Offset0: {
      // No offset
      break;
    }
    case IndexedAction.Offset8: {
      // 8 bit offset
      const offset = signExtend(await cpu.read(cpu.registers.pc, 1), 8, 16);
      cpu.registers.pc += 1;
      address += offset;
      break;
    }
    case IndexedAction.Offset16: {
      // 16 bit offset
      const offset = await cpu.read(cpu.registers.pc, 2);
      cpu.registers.pc += 2;
      address += offset;
      break;
    }
    case IndexedAction.OffsetA: {
      // A accumulator offset
      address += signExtend(cpu.registers.A, 8, 16);
      break;
    }
    case IndexedAction.OffsetB: {
      // B accumulator offset
      address += signExtend(cpu.registers.B, 8, 16);
      break;
    }
    case IndexedAction.OffsetD: {
      // D register offset
      address += cpu.registers.D;
      break;
    }
    case IndexedAction.PostInc1: {
      // Post-increment by 1
      cpu.registers[register] += 1;
      break;
    }
    case IndexedAction.PostInc2: {
      // Post-increment by 2
      cpu.registers[register] += 2;
      break;
    }
    case IndexedAction.PreDec1: {
      // Pre-Decrement by 1
      // TODO: Actually PRE-decrement, not POST-decrement.
      // TODO: This subtraction is wrong (if address == 0, it breaks wonderfully).
      cpu.registers[register] -= 1;
      break;
    }
    case IndexedAction.PreDec2: {
      // Pre-Decrement by 2
      // TODO: This subtraction is wrong.
      cpu.registers[register] -= 2;
      break;
    }
    case IndexedAction.OffsetPC8: {
      // 8 bit offset from PC (ignores register)
      const offset = signExtend(await cpu.read(cpu.registers.pc, 1), 8, 16);
      cpu.registers.pc += 1; // TODO: Check if this is correct (which PC value to use?
      // probably the one after the offset byte is read? That's not the case here).
      address += offset;
      break;
    }
    case IndexedAction.OffsetPC16: {
      // 16 bit offset from PC(ignores register)
      const offset = await cpu.read(cpu.registers.pc, 2);
      cpu.registers.pc += 2; // TODO: Check if this is correct (which PC value to use?...)
      address += offset;
      break;
    }
  }

  // Overflow!
  address = truncate(address, 16);

  if (indirect) {
    address = await cpu.read(address, 2);
  }

  return address;
}

type FetchableAddress = number | "pc";
/**
 * Returns the address given by the addressing mode (immediate, direct, indexed, extended, relative),
 * fetching any necessary data to calculate it from memory. (immediate <=> "pc")
 * @returns The address to read from (or "pc" if the address is the next byte to read).
 */
async function addressing<T extends AddressableAddressingMode>(
  cpu: Cpu,
  mode: T,
): Promise<T extends "immediate" ? "pc" : number> {
  type ReturnType = T extends "immediate" ? "pc" : number;

  switch (mode) {
    case "immediate":
      return "pc" as ReturnType;
    case "direct": {
      const low = await cpu.read(cpu.registers.pc, 1);
      cpu.registers.pc += 1;

      return ((cpu.registers.dp << 8) | low) as ReturnType;
    }
    case "indexed": {
      const postbyte = await cpu.read(cpu.registers.pc, 1);
      const parsedPostbyte = parseIndexedPostbyte(postbyte);
      cpu.registers.pc += 1;
      if (parsedPostbyte == null) throw new Error("[cpu] Invalid indexed postbyte");

      return (await indexedAddressing(cpu, parsedPostbyte)) as ReturnType;
    }
    case "extended": {
      const address = await cpu.read(cpu.registers.pc, 2);
      cpu.registers.pc += 2;
      return address as ReturnType;
    }
    case "relative": {
      // Only used for branches
      const offset = await cpu.read(cpu.registers.pc, 1);
      cpu.registers.pc += 1;
      return truncate(cpu.registers.pc + signExtend(offset, 8, 16), 16) as ReturnType;
    }
  }

  throw new Error("[cpu] Unknown addressing mode passed to addressing function");
}
/**
 * Returns the value at the given address, incrementing the program counter if the address is "pc"
 * (in the case of immediate addressing).
 * @param size The size of the value to read (in bytes).
 * @returns The value at the address.
 */
async function fetch(cpu: Cpu, address: FetchableAddress, size: number): Promise<number> {
  let val: number;
  if (address === "pc") {
    val = await cpu.read(cpu.registers.pc, size);
    cpu.registers.pc += size;
  } else {
    val = await cpu.read(address, size);
  }
  return val;
}

async function ld8(cpu: Cpu, reg: Accumulator, address: FetchableAddress): Promise<number> {
  const val = await fetch(cpu, address, 1);

  cpu.registers[reg] = val;

  // Clear V flag, set N if negative, Z if zero
  cpu.registers.cc &= ~(ConditionCodes.OVERFLOW | ConditionCodes.ZERO | ConditionCodes.NEGATIVE);
  cpu.registers.cc |= val === 0 ? ConditionCodes.ZERO : 0;
  cpu.registers.cc |= val & 0x80 ? ConditionCodes.NEGATIVE : 0;

  return 2;
}

async function ld16(cpu: Cpu, reg: Register, address: FetchableAddress): Promise<number> {
  const val = await fetch(cpu, address, 2);

  cpu.registers[reg] = val;

  // Clear V flag, set N if negative, Z if zero
  cpu.registers.cc &= ~(ConditionCodes.OVERFLOW | ConditionCodes.ZERO | ConditionCodes.NEGATIVE);
  cpu.registers.cc |= val === 0 ? ConditionCodes.ZERO : 0;
  cpu.registers.cc |= val & 0x8000 ? ConditionCodes.NEGATIVE : 0;

  return 3;
}

async function beq(cpu: Cpu, address: number): Promise<number> {
  // Zero flag set -> branch
  if (cpu.registers.cc & ConditionCodes.ZERO) {
    cpu.registers.pc = address;
  }
  return 3;
}

async function bra(cpu: Cpu, address: number): Promise<number> {
  cpu.registers.pc = address;
  return 3;
}

async function st8(cpu: Cpu, reg: Accumulator, address: number): Promise<number> {
  const val = cpu.registers[reg];

  await cpu.write(address, val, 1);

  // Clear V flag, set N if negative, Z if zero
  cpu.registers.cc &= ~(ConditionCodes.OVERFLOW | ConditionCodes.ZERO | ConditionCodes.NEGATIVE);
  cpu.registers.cc |= val === 0 ? ConditionCodes.ZERO : 0;
  cpu.registers.cc |= val & 0x80 ? ConditionCodes.NEGATIVE : 0;

  return 2;
}

async function clracc(cpu: Cpu, reg: Accumulator): Promise<number> {
  console.debug(`[cpu] instruction clr${reg}`);

  cpu.registers[reg] = 0;

  // Clear N,V,C, set Z
  cpu.registers.cc &= ~(ConditionCodes.OVERFLOW | ConditionCodes.CARRY | ConditionCodes.NEGATIVE);
  cpu.registers.cc |= ConditionCodes.ZERO;

  return 2;
}

export type InstructionData = {
  mnemonic: string;
  cycles: string;
  register: Accumulator | Register | "pc";
  mode: AddressingMode;
  function: InstructionLogic;
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

addInstructions("beq", [[0x27, "pc", "relative", "3"]], () => beq);
addInstructions("bra", [[0x20, "pc", "relative", "3"]], () => bra);

// clr(accumulator)
addInstructions(
  "clr{register}",
  [
    [0x4f, "A", "inherent", "3/1"],
    [0x5f, "B", "inherent", "3/1"],
  ],
  (reg, mode, cycles) => (cpu) => clracc(cpu, reg),
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
  (reg, mode, cycles) => (cpu, address) => ld16(cpu, reg, address),
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
  (reg, mode, cycles) => (cpu, address) => ld8(cpu, reg, address),
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
  (reg, mode, cycles) => (cpu, address) => st8(cpu, reg, address),
);

export async function doInstruction(cpu: Cpu, number: number): Promise<number> {
  const instruction = INSTRUCTIONS[number];
  if (instruction == null) {
    console.error(`Unknown instruction: ${number.toString(16)}`);
    return 1;
  }
  console.debug(
    `[cpu] instruction ${instruction.mnemonic}: reg=${instruction.register} mode=${instruction.mode}`,
  );

  // Perform addressing.
  let address = null;
  if (instruction.mode !== "inherent") address = await addressing(cpu, instruction.mode);

  return await instruction.function(cpu, address);
}
