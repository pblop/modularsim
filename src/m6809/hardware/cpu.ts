import type { IModule } from "../../types/module.js";
import type { ISimulator } from "../../types/simulator.js";
import type { EventDeclaration, TypedEventTransceiver } from "../../types/event.js";
import { doInstruction, INSTRUCTIONS } from "../util/instructions.js";
import { Registers, ConditionCodes } from "../util/cpu_parts.js";

type CpuConfig = {
  pc: number;
};

function validate_cpu_config(config: Record<string, unknown>): CpuConfig {
  if (typeof config.pc !== "number") throw new Error("[Clock] frequency must be a number");

  return config as CpuConfig;
}

// biome-ignore lint/style/useEnumInitializers: The enum values are not important.
enum CpuState {
  UNRESET,
  // Fetch the first byte of the opcode.
  FETCH_OPCODE,
  // Decode the opcode (and fetch the second byte if needed).
  DECODE_OPCODE,

  FAIL,
}

class Cpu implements IModule {
  id: string;
  config: CpuConfig;
  et: TypedEventTransceiver;

  interval_id?: number;

  registers: Registers;

  // Store the last read memory address, and the value read between states.
  lastRead: { address: number; value: number | null } | null = null;
  opcode: number | null = null;
  // The current state of the CPU state machine.
  state: CpuState;

  getEventDeclaration(): EventDeclaration {
    return {
      provided: [
        "cpu:instruction_finish",
        "memory:read",
        "memory:write",
        "cpu:register_update",
        "cpu:registers_update",
      ],
      required: {
        "clock:cycle_start": this.onCycleStart,
        "signal:reset": this.reset,
        "memory:read:result": this.onMemoryReadResult,
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
    this.state = CpuState.UNRESET;
    this.opcode = null;

    console.log(`[${this.id}] Module initialized.`);
  }

  commitRegisters = () => {
    // Object.entries doesn't include the prototype properties (A, B, copy, ...),
    // so we don't need to filter them out.
    const registers = Object.entries(this.registers);
    for (const [key, value] of registers) {
      this.et.emit("cpu:register_update", key, value);
    }
    this.et.emit("cpu:registers_update", this.registers.copy());
  };

  reset = () => {
    this.registers.dp = 0;
    this.registers.cc = 0;
    this.registers.D = 0;
    this.registers.X = 0;
    this.registers.Y = 0;
    this.registers.U = 0;
    this.registers.S = 0;
    this.registers.pc = this.config.pc;

    this.commitRegisters();

    this.printRegisters();

    this.state = CpuState.FETCH_OPCODE;
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
  _fetchOpCode = async () => {
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
      const val = (data >> (8 * (bytes - i - 1))) & 0xff;
      const promise = this.et.emitAndWait("memory:write", "memory:write:result", address + i, val);
      allPromises.push(promise);
    }
    return Promise.all(allPromises);
  };

  queryMemory = (address: number) => {
    this.lastRead = { address, value: null };
    this.et.emit("memory:read", address);
  };
  onMemoryReadResult = (address: number, data: number) => {
    if (!this.lastRead) return;
    // If the address is different, this is another module's read, or a stale
    // read, or something else, but we don't want it either way.
    if (this.lastRead.address !== address) return;

    this.lastRead.value = data;
  };

  fail = (message: string) => {
    console.error(`[${this.id}] ${message}`);
    this.state = CpuState.FAIL;
  };

  // Fetch the first byte of the opcode.
  fetchOpcode = () => {
    this.queryMemory(this.registers.pc);
    // Transition to the next state.
    this.state = CpuState.DECODE_OPCODE;
  };

  // Decode the opcode (and fetch the second byte if needed).
  decodeOpcode = () => {
    if (!this.lastRead) return this.fail("last read is null, but we're decoding a read");
    // If the last read is not ready, we wait for the memory read result.
    if (this.lastRead.value == null) return;

    // Convert the opcode bytes (one or two) to a single u16 containing the
    // whole opcode.
    // The low byte is the last byte read.
    // e.g. 0x10 0xAB -> 0x10AB
    // e.g. 0xAB -> 0xAB
    if (this.opcode === null) {
      this.opcode = this.lastRead.value;
    } else {
      this.opcode = (this.opcode << 8) | this.lastRead.value;
    }

    // Transition to the next state.

    // If the opcode is 0x10 or 0x11, we need to fetch another byte. In the docs,
    // it says that if the second byte is 0x10 or 0x11, we need to fetch another
    // byte, but the MC6809 has no 3-byte instructions. I'm following the docs here.
    if (this.opcode === 0x10 || this.opcode === 0x11) {
      this.queryMemory(this.registers.pc);
      this.state = CpuState.DECODE_OPCODE;
    } else {
      this.addressingSelection(this.opcode);
    }
  };

  addressingSelection = (opcode: number) => {
    const instruction = INSTRUCTIONS[opcode];
    if (!instruction) return this.fail(`Unknown opcode ${opcode.toString(16)}`);

    switch (instruction.mode) {
      case "direct":
        return this.fail("Direct addressing not implemented");
      case "indexed":
        return this.fail("Indexed addressing not implemented");
      case "inherent":
        return this.fail("Inherent addressing not implemented");
      case "relative":
        return this.fail("Relative addressing not implemented");
      case "immediate":
        return this.fail("Immediate addressing not implemented");
      case "extended":
        return this.fail("Extended addressing not implemented");
    }
  };

  /**
   * The entry point of the CPU state machine.
   */
  onCycleStart = () => {
    switch (this.state) {
      case CpuState.UNRESET:
        return this.fail("CPU not reset but cycle started");
      case CpuState.FETCH_OPCODE:
        this.fetchOpcode();
        break;
      case CpuState.DECODE_OPCODE:
        this.decodeOpcode();
        break;
      case CpuState.FAIL:
        break;
    }
  };
}

export default Cpu;
