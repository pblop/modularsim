import type Cpu from "../hardware/cpu";
import { ConditionCodes } from "../hardware/cpu";

// A function that takes a CPU, performs some operation, and returns the number
// of cycles the processor should wait.
type InstructionLogic = (cpu: Cpu) => Promise<number>;

type AddressingMode = "immediate" | "direct" | "indexed" | "extended";
type Registers = "X" | "Y" | "U" | "S";
type Accumulators = "A" | "B" | "D";

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
    case "indexed":
      throw new Error("Indexed addressing mode not implemented");
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
