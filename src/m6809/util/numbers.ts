export function truncate(val: number, bits: number): number {
  const mask = (1 << bits) - 1;
  return val & mask;
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
 * Convert a JS number to a signed integer of the given size.
 * @param num The number to convert.
 * @param size The size of the integer in bits.
 * @returns The converted number.
 */
export function numberToIntN(num: number, size: number): number {
  if (num < 0) {
    return twosComplement(-num, size);
  }
  return truncate(num, size);
}
