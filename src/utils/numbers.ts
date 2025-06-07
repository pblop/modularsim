export function truncate(val: number, bits: number): number {
  const mask = (1 << bits) - 1;
  return val & mask;
}
export function int8(val: number): number {
  return val & 0xff;
}
export function int16(val: number): number {
  return val & 0xffff;
}

export function indexBit(val: number, index: number): boolean {
  return !!(val & (1 << index));
}

export function isNegative(val: number, bits: number): boolean {
  // If the MSB is set, the number is negative.
  return !!(val & (1 << (bits - 1)));
}

export function signExtend(val: number, valBits: number, outBits: 8 | 16): number {
  return truncate((val << (32 - valBits)) >> (32 - valBits), outBits);
}

export function twosComplement(val: number, bits: number): number {
  return truncate(~val + 1, bits);
}

/**
 * Decomposes a number into an array of bytes (big-endian).
 * @param val - The number to decompose
 * @param bytes - The number of bytes to decompose into
 * @returns An array of numbers, where each number represents a byte from most
 * significant to most significant
 * @example
 * decompose(0x0102, 2) // returns [0x01, 0x02]
 * decompose(0x00000001, 4) // returns [0x00, 0x00, 0x00, 0x01]
 */
export function decompose(val: number, bytes: number): number[] {
  const result = [];
  for (let i = bytes - 1; i >= 0; i--) {
    result.push(truncate(val >> (i * 8), 8));
  }
  return result;
}

/**
 * Composes a single number from an array of bytes (big-endian).
 * @param bytes - An array of numbers, where each number represents a byte from
 * most significant to least significant
 * @returns The composed number
 * @example
 * compose([0x01, 0x02]) // returns 0x0102
 * compose([0x00, 0x00, 0x00, 0x01]) // returns 0x00000001
 */
export function compose(bytes: number[]): number {
  let result = 0;
  for (const byte of bytes) {
    result = (result << 8) | byte;
  }
  return result;
}

/**
 * Convert a JS Number to a signed integer of the given size.
 * @param num The Number to convert.
 * @param size The size of the integer in bits.
 * @returns The converted signed integer.
 */
export function numberToIntN(num: number, size: number): number {
  if (num < 0) {
    return twosComplement(-num, size);
  }
  return truncate(num, size);
}

/**
 * Convert a signed integer of a given size to a JS Number.
 * @param int The signed integer to convert.
 * @param size The size of the integer in bits.
 * @returns The converted Number.
 */
export function intNToNumber(int: number, size: number): number {
  if (isNegative(int, size)) {
    // The opposite of twosComplement is twosComplement itself, so we inverse
    // the negative number to get its positive counterpart, and then negate it.
    return -twosComplement(int, size);
  }
  // If the MSB is not set, the number is positive, and positive numbers don't
  // need any conversion.
  return int;
}

/**
 * Convert a number to a hexadecimal string representation.
 * @param val The number to convert.
 * @param bytes The width of the hexadecimal string in bytes (default is 1).
 * @returns The hexadecimal string representation of the number, padded to the
 * specified width.
 * @example
 * hex(255) // returns "ff"
 * hex(255, 2) // returns "00ff"
 */
export function hex(val: number, bytes = 1): string {
  const hexString = val.toString(16);
  return hexString.padStart(bytes * 2, "0");
}

export function hexSign(val: number, bytes = 1): string {
  return (val > 0 ? "+" : "") + hex(val, bytes);
}
