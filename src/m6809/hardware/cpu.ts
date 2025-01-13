import type { IModule } from "../../types/module.js";
import type { ISimulator } from "../../types/simulator.js";
import type { EventDeclaration, TypedEventTransceiver } from "../../types/event.js";
import { doInstruction } from "../util/instructions.js";

class Registers {
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

type CpuConfig = {
  pc: number;
};

function validate_cpu_config(config: Record<string, unknown>): CpuConfig {
  if (typeof config.pc !== "number") throw new Error("[Clock] frequency must be a number");

  return config as CpuConfig;
}

class Cpu implements IModule {
  id: string;
  config: CpuConfig;
  et: TypedEventTransceiver;

  interval_id?: number;

  registers: Registers;

  getEventDeclaration(): EventDeclaration {
    return {
      provided: ["cpu:instruction_finish", "memory:read", "memory:write"],
      required: {
        "clock:cycle_start": () => {},
        "signal:reset": this.reset,
        "memory:read:result": () => {},
        "memory:write:result": () => {},
      },
      optional: {},
    };
  }

  constructor(
    id: string,
    config: Record<string, unknown>,
    eventTransceiver: TypedEventTransceiver,
  ) {
    this.id = id;
    this.config = validate_cpu_config(config);
    this.et = eventTransceiver;

    this.registers = new Registers();

    console.log(`[${this.id}] Module initialized.`);
  }

  reset = () => {
    this.registers.dp = 0;
    this.registers.cc = 0;
    this.registers.D = 0;
    this.registers.X = 0;
    this.registers.Y = 0;
    this.registers.U = 0;
    this.registers.S = 0;
    this.registers.pc = this.config.pc;

    this.printRegisters();

    this.loop();
  };

  printRegisters = () => {
    console.table([
      Object.fromEntries(
        Object.entries(this.registers).map(([key, value]) => [key, `$${value.toString(16)}`]),
      ),
    ]);
  };

  /**
   * Fetches one or two bytes from memory, the opcode.
   * @returns An array with the bytes of the opcode.
   */
  fetchOpCode = async () => {
    const opcodeBytes: number[] = [];

    // TODO: Maybe do some comparison that the read address is the correct one?
    // (I'm ignoring the first returned value of memory:read:result, which is the
    // read address. Given no guarantees, it _probably_ _could happen_ that we
    // ask for an address at the same time as somebody else, and we get a wrong
    // memory read result!) (Check this again when I do fun memory mapping, with
    // directed memory reads! :p)
    // Maybe not needed, I am 85% sure it will never happen.
    const [_, b1] = await this.et.emitAndWait(
      "memory:read",
      "memory:read:result",
      this.registers.pc++,
    );
    if (b1 == null) throw new Error(`[${this.id}] CPU read an undefined byte!1!!`);
    opcodeBytes.push(b1);

    if (b1 === 0x10 || b1 === 0x11) {
      const [_, b2] = await this.et.emitAndWait(
        "memory:read",
        "memory:read:result",
        this.registers.pc++,
      );
      if (b2 == null) throw new Error(`[${this.id}] CPU read an undefined byte!1!!`);
      opcodeBytes.push(b2);
    }

    return opcodeBytes;
  };

  /**
   * Wrapper around the event emitter to read bytes from memory (big-endian).
   */
  read = async (address: number, bytes = 1) => {
    let val = 0;

    for (let i = 0; i < bytes; i++) {
      // TODO: Maybe do some comparison that the read address is the correct one?
      const [_, data] = await this.et.emitAndWait("memory:read", "memory:read:result", address + i);
      if (data == null) throw new Error(`[${this.id}] CPU read an undefined byte!1!!`);

      val = (val << 8) | data;
    }

    return val;
  };

  /**
   * Wrapper around the event emitter to write bytes to memory (big-endian).
   */
  write = async (address: number, data: number, bytes = 1) => {
    const allPromises = [];
    for (let i = 0; i < bytes; i++) {
      // The Motorola 6809 is big-endian, so we write the most significant byte first, that is
      // for index 0, we shift all the way to the right, for index 1, we shift 8 bits less, etc.
      const val = (data >> (8 * (bytes-i-1))) & 0xff;
      const promise = this.et.emitAndWait("memory:write", "memory:write:result", address + i, val);
      allPromises.push(promise);
    }
    return Promise.all(allPromises);
  }

  loop = async () => {
    while (true) {
      await this.et.wait("clock:cycle_start");
      // Get the instruction (this increments the PC)
      const opcodeBytes = await this.fetchOpCode();
      console.log(`[${this.id}] read opcode bytes ${opcodeBytes} at ${this.registers.pc}`);
      // Convert one or two bytes to single u16 containing the whole opcode.
      const opcode = (opcodeBytes[0] << 8) + (opcodeBytes.length > 1 ? opcodeBytes[1] : 0);
      console.log(
        `[${this.id}] opcode ${opcode.toString(16)} at ${this.registers.pc - opcodeBytes.length}`,
      );
      this.printRegisters();

      // Execute the instruction
      const waitCycles = await doInstruction(this, opcode);

      for (let i = 0; i < waitCycles; i++) {
        // TODO: Implement the wait cycle
      }

      this.et.emit("cpu:instruction_finish");
      this.printRegisters();
    }
  };
}

export default Cpu;
