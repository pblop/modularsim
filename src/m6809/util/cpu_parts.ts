export class Registers {
  dp: number;
  cc: number;
  D: number;
  X: number;
  Y: number;
  U: number;
  S: number;
  pc: number;

  constructor() {
    this.dp = -1;
    this.cc = -1;
    this.D = -1;
    this.X = -1;
    this.Y = -1;
    this.U = -1;
    this.S = -1;
    this.pc = -1;
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

  getCCStrings(): string[] {
    const ccStrings = [];
    for (const key in ConditionCodes) {
      const bitMask = ConditionCodes[key as keyof typeof ConditionCodes];
      if (this.cc & bitMask) ccStrings.push(key);
    }
    return ccStrings;
  }
  getShortCCStrings(): string[] {
    const ccStrings = [];
    for (const key in SHORT_CC_NAME_MAP) {
      const bitMask = SHORT_CC_NAME_MAP[key as ShortCCNames];
      if (this.cc & bitMask) ccStrings.push(key);
    }
    return ccStrings;
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
