import type Cpu from "../hardware/cpu";

// A function that takes a CPU, performs some operation, and returns the number
// of cycles the processor should wait.
type InstructionLogic = (cpu: Cpu) => Promise<number>;

const INSTRUCTIONS: Record<number, InstructionLogic> = {
  // ldx (immediate)
  0x8e00: async (cpu: Cpu) => {
    const val = await cpu.readByte(cpu.registers.pc++);
    cpu.registers.X = val;
    return 2;
  },
  // ldx (direct)
  0x9e00: async (cpu: Cpu) => 1,
  // ldx (indexed)
  0xae00: async (cpu: Cpu) => 1,
  // ldx (extended)
  0xbe00: async (cpu: Cpu) => 1,
};

export async function doInstruction(cpu: Cpu, number: number): Promise<number> {
  const instruction = INSTRUCTIONS[number];
  if (instruction == null) {
    console.error(`Unknown instruction: ${number.toString(16)}`);
    return 1;
  }

  return instruction(cpu);
}
