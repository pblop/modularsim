import type { IModule } from "../../types/module.js";
import type { ISimulator } from "../../types/simulator.js";
import type { EventDeclaration, TypedEventTransceiver } from "../../types/event.js";
import { doInstruction } from "../util/instructions.js";

type CpuConfig = {
  pc: number;
};

enum CpuState {
  UNINITIALISED = 0, // Pre-reset
  NO_INSTRUCTION = 1, //
  WAIT_FETCH_READ = 2, //
}

function validate_cpu_config(config: Record<string, unknown>): CpuConfig {
  if (typeof config.pc !== "number") throw new Error("[Clock] frequency must be a number");

  return config as CpuConfig;
}

type M6809Registers = {
  dp: number; // 8 bit
  cc: number; // 8 bit
  D: number; // 16 bit
  X: number; // 16 bit
  Y: number; // 16 bit
  U: number; // 16 bit
  S: number; // 16 bit
  pc: number; // 16 bit
};

enum ConditionCodes {
  CARRY = 1 << 0, // Carry
  OVERFLOW = 1 << 1, // Overflow
  ZERO = 1 << 2, // Zero
  NEGATIVE = 1 << 3, // Negative
  IRQ_MASK = 1 << 4, // IRQ Mask
  HALF_CARRY = 1 << 5, // Half Carry
  FIRQ_MASK = 1 << 6, // FIRQ Mask
  ENTIRE_FLAG = 1 << 7, // Entire Flag
}

class Cpu implements IModule {
  id: string;
  config: CpuConfig;
  et: TypedEventTransceiver;

  interval_id?: number;

  state: CpuState;
  waitCycles: number;

  registers: M6809Registers;

  getEventDeclaration(): EventDeclaration {
    return {
      provided: ["cpu:instruction_finish", "memory:read"],
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

    this.state = CpuState.UNINITIALISED;
    this.waitCycles = 0;
    this.registers = {
      dp: 0,
      cc: 0,
      D: 0,
      X: 0,
      Y: 0,
      U: 0,
      S: 0,
      pc: 0,
    };

    console.log(`[${this.id}] Module initialized.`);
  }

  reset = () => {
    this.state = CpuState.NO_INSTRUCTION;
    this.waitCycles = -1;

    this.registers = {
      dp: 0,
      cc: 0,
      D: 0,
      X: 0,
      Y: 0,
      U: 0,
      S: 0,
      pc: this.config.pc,
    };

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
   * Wrapper around the event emitter to read a single byte from memory.
   */
  readByte = async (address: number) => {
    // TODO: Maybe do some comparison that the read address is the correct one?
    const [_, data] = await this.et.emitAndWait("memory:read", "memory:read:result", address);
    if (data == null) throw new Error(`[${this.id}] CPU read an undefined byte!1!!`);
    return data;
  };

  loop = async () => {
    if (this.state === CpuState.UNINITIALISED)
      throw new Error(`[${this.id}] Tried to execute, but didn't receive reset`);
    // We must be running

    /* Fetch & Decode */
    const opcodeBytes = await this.fetchOpCode();
    // Convert one or two bytes to single u16 containing the whole opcode.
    const opcode = opcodeBytes[0] << (8 + opcodeBytes.length) > 1 ? opcodeBytes[1] : 0;
    console.log("[cpu] read opcode", opcode);
    this.printRegisters();

    const waitCycles = await doInstruction(this, opcode);

    for (let i = 0; i < waitCycles; i++) {
      // TODO: Implement the wait cycle
    }

    /* Execute */
  };
}

export default Cpu;
