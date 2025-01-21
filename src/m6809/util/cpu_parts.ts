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
}

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
