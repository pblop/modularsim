import type Cpu from "../hardware/cpu.js";
import { ConditionCodes } from "../hardware/cpu.js";

// A function that takes a CPU, performs some operation, and returns the number
// of cycles the processor should wait.
type InstructionLogic = (cpu: Cpu) => Promise<number>;

type AddressingMode = "immediate" | "direct" | "indexed" | "extended";
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

async function ld16(cpu: Cpu, reg: Registers, mode: AddressingMode): Promise<number> {
  console.debug(`[cpu] instruction ld16 ${reg} ${mode}`);

  let val: number;
  switch (mode) {
    case "immediate":
      val = await cpu.read(cpu.registers.pc, 2);
      cpu.registers.pc += 2;
      break;
    case "direct": {
      const address = await cpu.read(cpu.registers.pc, 2);
      cpu.registers.pc += 2;
      val = await cpu.read(address, 2);
      break;
    }
    case "indexed":
      throw new Error("Indexed addressing mode not implemented");
    case "extended":
      throw new Error("Extended addressing mode not implemented");
  }

  cpu.registers[reg] = val;

  // Clear V flag, set N if negative, Z if zero
  cpu.registers.cc &= ~(ConditionCodes.OVERFLOW | ConditionCodes.ZERO | ConditionCodes.NEGATIVE);
  cpu.registers.cc |= val === 0 ? ConditionCodes.ZERO : 0;
  cpu.registers.cc |= val & 0x8000 ? ConditionCodes.NEGATIVE : 0;

  return 3;
}

async function indexedAddressing(cpu: Cpu, postbyte: number): Promise<number> {
  const fivebit = (postbyte & 0x80) >> 7;
  const indirect = (postbyte & 0x10) >> 4;
  const RR = (postbyte & 0xc0) >> 6; // 00 = X, 01 = Y, 10 = U, 11 = S

  const rest = postbyte & 0xf;

  // Get the register to use (given by RR in all but 4 cases).
  let register: Registers | "pc";
  if (rest === 0b1100 || rest === 0b1101) // 8 or 16 bit offset from PC
    register = "pc";
  else
    register = ["X", "Y", "U", "S"][RR] as Registers;

  let address: number = cpu.registers[register];
  if (fivebit) {
    // Non-Indirect, 5 bit offset
    console.debug("TODO: Implement 5 bit offset");
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
        // Increment by 1
        address += 1;
        break;
      }
      case 0b0001: {
        // Increment by 2
        address += 2;
        break;
      }
      case 0b0010: {
        // Decrement by 1
        // TODO: This subtraction is wrong (if address == 0, it breaks wonderfully).
        address -= 1;
        break;
      }
      case 0b0011: {
        // Decrement by 2
        // TODO: This subtraction is wrong.
        address -= 2;
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


async function ld8(cpu: Cpu, reg: Accumulators, mode: AddressingMode): Promise<number> {
  console.debug(`[cpu] instruction ld8 ${reg} ${mode}`);

  let val: number;
  switch (mode) {
    case "immediate":
      val = await cpu.read(cpu.registers.pc, 1);
      cpu.registers.pc += 1;
      break;
    case "direct": {
      const address = await cpu.read(cpu.registers.pc, 2);
      cpu.registers.pc += 2;
      val = await cpu.read(address, 1);
      break;
    }
    case "indexed": {
      const postbyte = await cpu.read(cpu.registers.pc, 1);
      cpu.registers.pc += 1;

      val = await indexedAddressing(cpu, postbyte);
      break;
    }
    case "extended":
      throw new Error("Extended addressing mode not implemented");
  }

  cpu.registers[reg] = val;

  // Clear V flag, set N if negative, Z if zero
  cpu.registers.cc &= ~(ConditionCodes.OVERFLOW | ConditionCodes.ZERO | ConditionCodes.NEGATIVE);
  cpu.registers.cc |= val === 0 ? ConditionCodes.ZERO : 0;
  cpu.registers.cc |= val & 0x80 ? ConditionCodes.NEGATIVE : 0;

  return 2;
}

const INSTRUCTIONS: Record<number, InstructionLogic> = {
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
};

export async function doInstruction(cpu: Cpu, number: number): Promise<number> {
  const instruction = INSTRUCTIONS[number];
  if (instruction == null) {
    console.error(`Unknown instruction: ${number.toString(16)}`);
    return 1;
  }

  return await instruction(cpu);
}
