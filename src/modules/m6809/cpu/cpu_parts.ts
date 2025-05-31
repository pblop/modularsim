export function ccToStrings(cc: number): string[] {
  const ccStrings = [];
  for (const key in ConditionCodes) {
    const bitMask = ConditionCodes[key as keyof typeof ConditionCodes];
    if (cc & bitMask) ccStrings.push(key);
  }
  return ccStrings;
}
export function ccToShortStrings(cc: number, addNotSet = false): string[] {
  const ccStrings = [];
  for (const key in SHORT_CC_NAME_MAP) {
    const bitMask = SHORT_CC_NAME_MAP[key as ShortCCNames];
    if (cc & bitMask) ccStrings.push(key);
    else if (addNotSet) ccStrings.push("");
  }
  return ccStrings;
}

export class Registers {
  dp: number;
  cc: number;
  D: number;
  X: number;
  Y: number;
  U: number;
  S: number;
  pc: number;

  constructor(dp = -1, cc = -1, D = -1, X = -1, Y = -1, U = -1, S = -1, pc = -1) {
    this.dp = dp;
    this.cc = cc;
    this.D = D;
    this.X = X;
    this.Y = Y;
    this.U = U;
    this.S = S;
    this.pc = pc;
  }

  get A() {
    return this.D >> 8;
  }
  set A(val: number) {
    this.D = (val << 8) | (this.D & 0xff);
  }
  get B() {
    return this.D & 0xff;
  }
  set B(val: number) {
    this.D = (this.D & 0xff00) | val;
  }

  copy(): Registers {
    const copy = new Registers();
    copy.dp = this.dp;
    copy.cc = this.cc;
    copy.D = this.D;
    copy.X = this.X;
    copy.Y = this.Y;
    copy.U = this.U;
    copy.S = this.S;
    copy.pc = this.pc;
    return copy;
  }
}

/**
 * Register sizes in _bytes_.
 */
export const REGISTER_SIZE = {
  A: 1,
  B: 1,
  D: 2,
  X: 2,
  Y: 2,
  U: 2,
  S: 2,
  pc: 2,
  cc: 1,
  dp: 1,
};

/**
 * E = Entire Flag,
 * F = FIRQ Mask,
 * H = Half Carry,
 * I = IRQ Mask,
 * N = Negative,
 * Z = Zero,
 * V = Overflow,
 * C = Carry
 */
export enum ConditionCodes {
  CARRY = 1 << 0, // Carry
  OVERFLOW = 1 << 1, // Overflow
  ZERO = 1 << 2, // Zero
  NEGATIVE = 1 << 3, // Negative
  IRQ_MASK = 1 << 4, // IRQ Mask
  HALF_CARRY = 1 << 5, // Half Carry
  FIRQ_MASK = 1 << 6, // FIRQ Mask
  ENTIRE_FLAG = 1 << 7, // Entire Flag
}

export type ShortCCNames = "E" | "F" | "H" | "I" | "N" | "Z" | "V" | "C";
export const SHORT_CC_NAME_MAP: Record<ShortCCNames, ConditionCodes> = {
  E: ConditionCodes.ENTIRE_FLAG,
  F: ConditionCodes.FIRQ_MASK,
  H: ConditionCodes.HALF_CARRY,
  I: ConditionCodes.IRQ_MASK,
  N: ConditionCodes.NEGATIVE,
  Z: ConditionCodes.ZERO,
  V: ConditionCodes.OVERFLOW,
  C: ConditionCodes.CARRY,
};
