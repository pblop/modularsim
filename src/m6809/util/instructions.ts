export enum AddressingModes {
  IMMEDIATE = "immediate",
  DIRECT = "direct",
  INDEXED = "indexed",
  EXTENDED = "extended",
  INHERENT = "inherent",
}
export type Instruction = {
  name: string;
  opcode: number;
  addrmode: AddressingModes;
  args?: number[];
};

/**
 *
 * @param byteArr An array
 * @returns A parsed instruction if the instruction given is valid, a string
 * containing "partial" if the instruction requires more bytes, or null if
 * the instruction is not valid.
 */
export function parseInstruction(bytes: number[]): string | Instruction | null {
  const instruction: Partial<Instruction> = {};

  if (bytes[0] === 0x10 || bytes[0] === 0x11) {
    throw new Error("multi-byte opcodes not supported yet");
  }

  const am = bytes[0] & (0b00110000 >> 4);

  if (am === 0x00) instruction.addrmode = AddressingModes.IMMEDIATE;
  else if (am === 0x01) instruction.addrmode = AddressingModes.DIRECT;
  else if (am === 0x10) instruction.addrmode = AddressingModes.INDEXED;
  else if (am === 0x11) instruction.addrmode = AddressingModes.EXTENDED;

  return null;
}
