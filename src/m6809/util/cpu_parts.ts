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
