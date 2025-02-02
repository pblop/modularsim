export function truncate(val: number, bits: number): number {
  const mask = (1 << bits) - 1;
  return val & mask;
}

export function indexBit(val: number, index: number): boolean {
  return !!(val & (1 << index));
}

export function isNegative(val: number, bits: number): boolean {
  // If the MSB is set, the number is negative.
  return !!(val & (1 << (bits - 1)));
}

export function signExtend(val: number, valBits: number, outBits: number): number {
  const signBit = 1 << (valBits - 1);
  // (1 << outBits) - 1 is a mask with the bottom outBits bits set to 1.
  // (1 << valBits) - 1 is a mask with the bottom valBits bits set to 1.
  // Subtracting the two gives a mask with the bottom valBits bits set to 0,
  // and the rest set to 1.
  const mask = (1 << outBits) - 1 - ((1 << valBits) - 1);

  // If the number is negative, set the bits on top to 1s, otherwise set them to 0s.
  return val & signBit ? val | mask : val;
}

export function twosComplement(val: number, bits: number): number {
  return truncate(~val + 1, bits);
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
