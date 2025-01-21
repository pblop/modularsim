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
