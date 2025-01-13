import type Cpu from "../hardware/cpu.js";
import { ConditionCodes } from "../hardware/cpu.js";

// A function that takes a CPU, performs some operation, and returns the number
// of cycles the processor should wait.
type InstructionLogic = (cpu: Cpu) => Promise<number>;

type AddressingMode = "immediate" | "direct" | "indexed" | "extended" | "relative";
type Registers = "X" | "Y" | "U" | "S";
type Accumulators = "A" | "B" | "D";

function wrap(val: number, bits: number): number {
  const mask = (1 << bits) - 1;
  return val & mask;
}

function signExtend(val: number, valBits: number, outBits: number): number {
  const signBit = 1 << (valBits - 1);
  // (1 << outBits) - 1 is a mask with the bottom outBits bits set to 1.
  // (1 << valBits) - 1 is a mask with the bottom valBits bits set to 1.
  // Subtracting the two gives a mask with the bottom valBits bits set to 0,
  // and the rest set to 1.
  const mask = ((1 << outBits) - 1) - ((1 << valBits) - 1);

  // If the number is negative, set the bits on top to 1s, otherwise set them to 0s.
  return val & signBit ? val | mask : val;
}

async function indexedAddressing(cpu: Cpu, postbyte: number): Promise<number> {
  const fivebit = !((postbyte & 0x80) >> 7);
  const indirect = (postbyte & 0x10) >> 4;
  const RR = (postbyte & 0x60) >> 5; // 00 = X, 01 = Y, 10 = U, 11 = S

  console.debug(`[cpu] indexed addressing: ${postbyte.toString(16)} ${fivebit} ${indirect} ${RR}`);
  const rest = postbyte & 0xf;

  // Get the register to use (given by RR in all but 4 cases).
  let register: Registers | "pc";
  if (rest === 0b1100 || rest === 0b1101) // 8 or 16 bit offset from PC
    register = "pc";
  else
    register = ["X", "Y", "U", "S"][RR] as Registers;

  console.debug(`[cpu] indexed addressing: register ${register}`);
    
  let address: number = cpu.registers[register];
  if (fivebit) {
    // Non-Indirect, 5 bit offset
    const offset = signExtend(rest, 5, 16);
    address += offset;
  } else {
    switch (rest) {
      case 0b0100: {
        // No offset
        break;
      }
      case 0b1000: {
        // 8 bit offset
        const offset = signExtend(await cpu.read(cpu.registers.pc, 1), 8, 16);
        cpu.registers.pc += 1;
        address += offset;
        break;
      }
      case 0b1001: {
        // 16 bit offset
        const offset = await cpu.read(cpu.registers.pc, 2);
        cpu.registers.pc += 2;
        address += offset;
        break;
      }
      case 0b0110: {
        // A accumulator offset
        address += signExtend(cpu.registers.A, 8, 16);
        break;
      }
      case 0b0101: {
        // B accumulator offset
        address += signExtend(cpu.registers.B, 8, 16);
        break;
      }
      case 0b1011: {
        // D register offset
        address += cpu.registers.D;
        break;
      }
      case 0b0000: {
        // Post-increment by 1
        cpu.registers[register] += 1;
        break;
      }
      case 0b0001: {
        // Post-increment by 2
        cpu.registers[register] += 2;
        break;
      }
      case 0b0010: {
        // Pre-Decrement by 1 
        // TODO: Actually PRE-decrement, not POST-decrement.
        // TODO: This subtraction is wrong (if address == 0, it breaks wonderfully).
        cpu.registers[register] -= 1;
        break;
      }
      case 0b0011: {
        // Pre-Decrement by 2
        // TODO: This subtraction is wrong.
        cpu.registers[register] -= 2;
        break;
      }
      case 0b1100: {
        // 8 bit offset from PC (ignores register)
        const offset = signExtend(await cpu.read(cpu.registers.pc, 1), 8, 16);
        cpu.registers.pc += 1; // TODO: Check if this is correct (which PC value to use?
        // probably the one after the offset byte is read? That's not the case here).
        address += offset;
        break;
      }
      case 0b1101: {
        // 16 bit offset from PC(ignores register)
        const offset = await cpu.read(cpu.registers.pc, 2);
        cpu.registers.pc += 2; // TODO: Check if this is correct (which PC value to use?...)
        address += offset;
        break;
      }
    }
  }
  
  // Overflow!
  address = wrap(address, 16);
  
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
async function addressing<T extends AddressingMode>(cpu: Cpu, mode: T): Promise<T extends "immediate" ? "pc" : number> {
  type ReturnType = T extends "immediate" ? "pc" : number;
  
  switch (mode) {
    case "immediate":
      return "pc" as ReturnType;
    case "direct": {
      // TODO: Implement direct addressing (hand-in-hand with paging)
      console.error("Direct addressing not implemented");
      return 0 as ReturnType;
    }
    case "indexed": {
      const postbyte = await cpu.read(cpu.registers.pc, 1);
      cpu.registers.pc += 1;

      return await indexedAddressing(cpu, postbyte) as ReturnType;
    }
    case "extended":
      const address = await cpu.read(cpu.registers.pc, 2);
      cpu.registers.pc += 2;
      return address as ReturnType;
    case "relative": // Only used for branches
      const offset = await cpu.read(cpu.registers.pc, 1);
      cpu.registers.pc += 1;
      return (cpu.registers.pc + signExtend(offset, 8, 16)) as ReturnType;
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

async function ld8(cpu: Cpu, reg: Accumulators, mode: AddressingMode): Promise<number> {
  console.debug(`[cpu] instruction ld8 ${reg} ${mode}`);

  const address = await addressing(cpu, mode);
  const val = await fetch(cpu, address, 1);

  cpu.registers[reg] = val;

  // Clear V flag, set N if negative, Z if zero
  cpu.registers.cc &= ~(ConditionCodes.OVERFLOW | ConditionCodes.ZERO | ConditionCodes.NEGATIVE);
  cpu.registers.cc |= val === 0 ? ConditionCodes.ZERO : 0;
  cpu.registers.cc |= val & 0x80 ? ConditionCodes.NEGATIVE : 0;

  return 2;
}

async function ld16(cpu: Cpu, reg: Registers, mode: AddressingMode): Promise<number> {
  console.debug(`[cpu] instruction ld16 ${reg} ${mode}`);

  const address = await addressing(cpu, mode);
  const val = await fetch(cpu, address, 2);

  cpu.registers[reg] = val;

  // Clear V flag, set N if negative, Z if zero
  cpu.registers.cc &= ~(ConditionCodes.OVERFLOW | ConditionCodes.ZERO | ConditionCodes.NEGATIVE);
  cpu.registers.cc |= val === 0 ? ConditionCodes.ZERO : 0;
  cpu.registers.cc |= val & 0x8000 ? ConditionCodes.NEGATIVE : 0;

  return 3;
}

async function beq(cpu: Cpu): Promise<number> {
  console.debug("[cpu] instruction beq");

  const address = await addressing(cpu, "relative");

  // Zero flag set -> branch
  if (cpu.registers.cc & ConditionCodes.ZERO) {
    cpu.registers.pc = address;
  }
  return 3;
}

async function bra(cpu: Cpu): Promise<number> {
  console.debug("[cpu] instruction bra");

  const address = await addressing(cpu, "relative");

  cpu.registers.pc = address;
  return 3;
}

async function st8(cpu: Cpu, reg: Accumulators, mode: Exclude<AddressingMode, "immediate">): Promise<number> {
  console.debug(`[cpu] instruction st8 ${reg} ${mode}`);

  const address = await addressing(cpu, mode);
  const val = cpu.registers[reg];

  await cpu.write(address, val, 1);

  // Clear V flag, set N if negative, Z if zero
  cpu.registers.cc &= ~(ConditionCodes.OVERFLOW | ConditionCodes.ZERO | ConditionCodes.NEGATIVE);
  cpu.registers.cc |= val === 0 ? ConditionCodes.ZERO : 0;
  cpu.registers.cc |= val & 0x80 ? ConditionCodes.NEGATIVE : 0;

  return 2;
}

async function clracc(cpu: Cpu, reg: "A" | "B"): Promise<number> {
  console.debug(`[cpu] instruction clr${reg}`);

  cpu.registers[reg] = 0;

  // Clear N,V,C, set Z
  cpu.registers.cc &= ~(ConditionCodes.OVERFLOW | ConditionCodes.CARRY | ConditionCodes.NEGATIVE);
  cpu.registers.cc |= ConditionCodes.ZERO;

  return 2;
}

const INSTRUCTIONS: Record<number, InstructionLogic> = {
  // branching
  0x2700: beq,
  0x2000: bra,
  // clr(accumulator)
  0x4f00: (cpu: Cpu) => clracc(cpu, "A"),
  0x5f00: (cpu: Cpu) => clracc(cpu, "B"),
  // ldx
  0x8e00: (cpu: Cpu) => ld16(cpu, "X", "immediate"),
  0x9e00: (cpu: Cpu) => ld16(cpu, "X", "direct"),
  0xae00: (cpu: Cpu) => ld16(cpu, "X", "indexed"),
  0xbe00: (cpu: Cpu) => ld16(cpu, "X", "extended"),
  // lda
  0x8600: (cpu: Cpu) => ld8(cpu, "A", "immediate"),
  0x9600: (cpu: Cpu) => ld8(cpu, "A", "direct"),
  0xa600: (cpu: Cpu) => ld8(cpu, "A", "indexed"),
  0xb600: (cpu: Cpu) => ld8(cpu, "A", "extended"),
  // sta
  0x9700: (cpu: Cpu) => st8(cpu, "A", "direct"),
  0xa700: (cpu: Cpu) => st8(cpu, "A", "indexed"),
  0xb700: (cpu: Cpu) => st8(cpu, "A", "extended"),
  // stb
  0xd700: (cpu: Cpu) => st8(cpu, "B", "extended"),
  0xe700: (cpu: Cpu) => st8(cpu, "B", "indexed"),
  0xf700: (cpu: Cpu) => st8(cpu, "B", "direct"),
};

export async function doInstruction(cpu: Cpu, number: number): Promise<number> {
  const instruction = INSTRUCTIONS[number];
  if (instruction == null) {
    console.error(`Unknown instruction: ${number.toString(16)}`);
    return 1;
  }

  return await instruction(cpu);
}
