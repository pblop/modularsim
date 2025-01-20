import type Cpu from "../hardware/cpu.js";
import { ConditionCodes } from "../hardware/cpu.js";

// A function that takes a CPU, performs some operation, and returns the number
// of cycles the processor should wait.
type InstructionLogic = (cpu: Cpu) => Promise<number>;

type AddressingMode = AddressableAddressingMode | "inherent";
type AddressableAddressingMode = "immediate" | "direct" | "indexed" | "extended" | "relative";
type Register = "X" | "Y" | "U" | "S";
type Accumulator = "A" | "B" | "D";

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
  const mask = (1 << outBits) - 1 - ((1 << valBits) - 1);

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
  let register: Register | "pc";
  if (rest === 0b1100 || rest === 0b1101)
    // 8 or 16 bit offset from PC
    register = "pc";
  else register = ["X", "Y", "U", "S"][RR] as Register;

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
      cpu.registers.pc += 1;

      return (await indexedAddressing(cpu, postbyte)) as ReturnType;
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
      return wrap(cpu.registers.pc + signExtend(offset, 8, 16), 16) as ReturnType;
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

async function ld8(cpu: Cpu, reg: Accumulator, mode: AddressableAddressingMode): Promise<number> {
  const address = await addressing(cpu, mode);
  const val = await fetch(cpu, address, 1);

  cpu.registers[reg] = val;

  // Clear V flag, set N if negative, Z if zero
  cpu.registers.cc &= ~(ConditionCodes.OVERFLOW | ConditionCodes.ZERO | ConditionCodes.NEGATIVE);
  cpu.registers.cc |= val === 0 ? ConditionCodes.ZERO : 0;
  cpu.registers.cc |= val & 0x80 ? ConditionCodes.NEGATIVE : 0;

  return 2;
}

async function ld16(cpu: Cpu, reg: Register, mode: AddressableAddressingMode): Promise<number> {
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
  const address = await addressing(cpu, "relative");

  // Zero flag set -> branch
  if (cpu.registers.cc & ConditionCodes.ZERO) {
    cpu.registers.pc = address;
  }
  return 3;
}

async function bra(cpu: Cpu): Promise<number> {
  const address = await addressing(cpu, "relative");

  cpu.registers.pc = address;
  return 3;
}

async function st8(
  cpu: Cpu,
  reg: Accumulator,
  mode: Exclude<AddressableAddressingMode, "immediate">,
): Promise<number> {
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

type InstructionData = {
  name: string;
  cycles: string;
  register: Accumulator | Register | "pc";
  mode: AddressingMode;
  function: InstructionLogic;
};
const INSTRUCTIONS: Record<number, InstructionData> = {
  // branching
  0x27: {
    name: "beq",
    cycles: "3",
    register: "pc",
    mode: "relative",
    function: beq,
  },
  0x20: {
    name: "bra",
    cycles: "3",
    register: "pc",
    mode: "relative",
    function: bra,
  },
};

/**
 * Helper function to add instructions to the INSTRUCTIONS object in a more readable way.
 * @param name The name of the instruction (a '{register}' will be replaced with the register name).
 * @param modes An array of [opcode, register, addressing mode, cycles] tuples.
 * @param logic A function that, given the register, mode, and cycles, returns the instruction logic (useful
 * for instructions that have the same logic but different modes).
 */
function addInstructions<R extends Accumulator | Register | "pc", M extends AddressingMode>(
  name: string,
  modes: [number, R, M, string][], // [opcode, register, addressing mode, cycles]
  logic: (register: R, mode: M, cycles: string) => InstructionLogic,
) {
  for (const [opcode, register, mode, cycles] of modes) {
    INSTRUCTIONS[opcode] = {
      name: name.replace("{register}", register.toLowerCase()),
      register,
      mode,
      cycles,
      function: logic(register, mode, cycles),
    };
  }
}

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
    [0x8e, "X", "immediate", "3"],
    [0x9e, "X", "direct", "5/4"],
    [0xae, "X", "indexed", "5+"],
    [0xbe, "X", "extended", "6/5"],
  ],
  (reg, mode, cycles) => (cpu) => ld16(cpu, reg, mode),
);
// ld8 (lda, ...)
addInstructions(
  "ld{register}",
  [
    [0x86, "A", "immediate", "2"],
    [0x96, "A", "direct", "4/3"],
    [0xa6, "A", "indexed", "4+"],
    [0xb6, "A", "extended", "5/4"],
  ],
  (reg, mode, cycles) => (cpu) => ld8(cpu, reg, mode),
);
// st8 (sta, stb, ...)
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
  (reg, mode, cycles) => (cpu) => st8(cpu, reg, mode),
);

export async function doInstruction(cpu: Cpu, number: number): Promise<number> {
  const instruction = INSTRUCTIONS[number];
  if (instruction == null) {
    console.error(`Unknown instruction: ${number.toString(16)}`);
    return 1;
  }
  console.debug(
    `[cpu] instruction ${instruction.name}: reg=${instruction.register} mode=${instruction.mode}`,
  );

  return await instruction.function(cpu);
}
