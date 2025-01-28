import type { IModule } from "../../types/module.js";
import type { ISimulator } from "../../types/simulator.js";
import type { EventDeclaration, TypedEventTransceiver } from "../../types/event.js";
import type { EmptyObject } from "../../types/common.js";
import {
  type AddressingMode,
  type InstructionData,
  INSTRUCTIONS,
  performInstructionLogic,
} from "../util/instructions.js";
import { Registers, ConditionCodes, REGISTER_SIZE } from "../util/cpu_parts.js";
import {
  type CpuState,
  type OnEnterFn,
  type OnExitFn,
  StateMachine,
} from "../util/state_machine.js";

type CpuConfig = {
  pc: number;
};

function validate_cpu_config(config: Record<string, unknown>): CpuConfig {
  if (typeof config.pc !== "number") throw new Error("[Clock] frequency must be a number");

  return config as CpuConfig;
}

type CpuImmediateAddressingData = {
  mode: "immediate";
  value: number;
};
type CpuDirectAddressingData = {
  mode: "direct";
  address: number;
};
export type CpuAddressingData<M extends AddressingMode> = M extends "immediate"
  ? CpuImmediateAddressingData
  : CpuDirectAddressingData;

class Cpu implements IModule {
  id: string;
  config: CpuConfig;
  et: TypedEventTransceiver;

  interval_id?: number;

  registers: Registers;

  // Store the last read memory address, and the value read between states.
  readInfo: {
    address: number;
    value: number;
    bytes: number;
    raw: number[];
    waiting: boolean;
  } | null = null;

  // The current opcode being executed (if any)
  opcode?: number;
  // The current instruction being executed (if already decoded)
  instruction?: InstructionData;
  addressing?: CpuAddressingData<AddressingMode>;

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

    // this.printRegisters();
    // this.stateMachine.forceTransition("fetch_opcode", { readPending: false, writePending: false }); // Start the CPU state machine.
    this.stateMachine.setState("start");
  };

  printRegisters = () => {
    console.table([
      Object.fromEntries(
        Object.entries(this.registers).map(([key, value]) => [key, `$${value.toString(16)}`]),
      ),
    ]);
  };

  queryMemory = (address: number, bytes: number) => {
    this.readInfo = { address, value: 0, bytes, raw: [], waiting: false };
    this.queryPendingMemory();
  };
  queryPendingMemory = () => {
    if (!this.readInfo || this.readInfo.raw.length === this.readInfo.bytes) return;

    this.et.emit("memory:read", this.readInfo.address + this.readInfo.raw.length);
    this.readInfo.waiting = true;
  };
  onMemoryReadResult = (address: number, data: number) => {
    if (!this.readInfo) return;

    // If the address is different, this is another module's read, or a stale
    // read, or something else, but we don't want it either way.
    if (this.readInfo.address + this.readInfo.raw.length !== address) return;

    this.readInfo.raw.push(data);
    this.readInfo.waiting = false;

    // If we have all the bytes, we can convert them to a single Big-Endian
    // value. I do this here, but doing it at the beginning of the onCycleStart
    // function would be functionally equivalent.
    if (this.readInfo.raw.length === this.readInfo.bytes) {
      this.readInfo.value = this.readInfo.raw.reduce((acc, byte) => (acc << 8) | byte, 0);
    }
  };

  fail = (message: string): CpuState => {
    console.error(`[${this.id}] ${message}`);
    return "fail";
  };

  enterFetchOpcode: OnEnterFn<"fetch_opcode"> = ({ readPending }, _) => {
    if (readPending) return undefined;

    // Fetch the opcode.
    this.queryMemory(this.registers.pc++, 1);
    return;
  };
  exitFetchOpcode: OnExitFn<"fetch_opcode"> = ({ readPending }, { ctx }) => {
    if (readPending) return null;

    // Convert the opcode bytes (one or two) to a single u16 containing the
    // whole opcode.
    // The low byte is the last byte read.
    // e.g. 0x10 0xAB -> 0x10AB
    // e.g. 0xAB -> 0xAB
    if (ctx.opcode === undefined) {
      ctx.opcode = this.readInfo!.value!;
    } else {
      ctx.opcode = (ctx.opcode << 8) | this.readInfo!.value!;
    }

    // If the opcode is 0x10 or 0x11, we need to fetch another byte. In the docs,
    // it says that if the second byte is 0x10 or 0x11, we need to fetch another
    // byte, but the MC6809 has no 3-byte instructions. I'm following the docs here.
    if (ctx.opcode === 0x10 || ctx.opcode === 0x11) {
      this.queryMemory(this.registers.pc++, 1);
      return null;
    } else {
      // We now have the full opcode, so we can store it, and decode it.
      this.opcode = ctx.opcode;
      const instruction = INSTRUCTIONS[ctx.opcode];

      if (!instruction) return this.fail(`Unknown opcode ${ctx.opcode.toString(16)}`);
      this.instruction = instruction;

      switch (instruction.mode) {
        case "immediate":
          return "immediate";
        default:
          return this.fail(`Addressing mode ${instruction.mode} not implemented`);
      }
    }
  };

  enterImmediate: OnEnterFn<"immediate"> = ({ readPending }, _) => {
    if (readPending) return undefined;

    // Fetch the immediate value.
    const reg = this.instruction!.register;
    const regSize = REGISTER_SIZE[reg];
    this.queryMemory(this.registers.pc, regSize);
    this.registers.pc += regSize;
  };
  exitImmediate: OnExitFn<"immediate"> = ({ readPending }, _) => {
    if (readPending) return null;

    // We have the immediate value, so we can store it in the addressing info.
    const value = this.readInfo!.value!;
    this.addressing = { mode: "immediate", value };

    // Perform instruction execution.
    return "execute";
  };

  enterExecute: OnEnterFn<"execute"> = (cpuInfo, stateInfo) => {
    if (stateInfo.ctx.isDone === undefined) stateInfo.ctx.isDone = false;

    if (this.instruction === undefined) {
      this.fail("No instruction to execute");
      return false;
    }
    if (this.addressing === undefined) {
      this.fail("No addressing mode to execute");
      return false;
    }

    console.log(
      `[${this.id}] Executing instruction ${this.instruction.mnemonic} ${this.addressing.mode}`,
    );

    const done = performInstructionLogic(
      this,
      cpuInfo,
      stateInfo,
      this.instruction,
      this.addressing,
      this.registers,
    );

    stateInfo.ctx.isDone = done;
    if (done) return true;
  };

  exitExecute: OnExitFn<"execute"> = (cpuInfo, stateInfo) => {
    if (!stateInfo.ctx.isDone) return null;

    this.onInstructionFinish();
    return "fetch_opcode";
  };
  /**
   * Notify other modules that the instruction has ended, and, as such, our
   * registers have been updated.
   * Also, reset the instruction-related fields, so we can start a new one.
   */
  onInstructionFinish = () => {
    // NOTE: Could be a good idea to modify this to also emit the instruction
    // that was executed, so other modules can react to it.
    this.et.emit("cpu:instruction_finish");
    this.commitRegisters();

    this.opcode = undefined;
    this.instruction = undefined;
    this.addressing = undefined;
  };

  stateMachine: StateMachine = new StateMachine(
    {
      unreset: {
        onEnter: () => false,
        onExit: () => this.fail("CPU is not reset"),
      },
      start: {
        onEnter: () => false, // This is never called
        onExit: () => "fetch_opcode",
      },
      fetch_opcode: {
        onEnter: this.enterFetchOpcode,
        onExit: this.exitFetchOpcode,
      },
      immediate: {
        onEnter: this.enterImmediate,
        onExit: this.exitImmediate,
      },
      execute: {
        onEnter: this.enterExecute,
        onExit: this.exitExecute,
      },
      fail: {
        onEnter: () => false,
        onExit: () => null,
      },
    },
    "unreset",
  );

  /**
   * The entry point of the CPU state machine.
   */
  onCycleStart = () => {
    const readPending = this.readInfo != null && this.readInfo.bytes !== this.readInfo.raw.length;
    const writePending = false;

    // Read memory is ubiquitous for all states. We query it if we need it.
    // Explanation: we query if we haven't finished a read, but we're not waiting
    // for a result (i.e. we only read one byte at a time).
    if (readPending && !this.readInfo!.waiting) {
      this.queryPendingMemory();
    }

    debugger;
    console.debug(`[${this.id}] exit CPU state: ${this.stateMachine.current}`);
    this.stateMachine.tick({
      readPending,
      writePending,
    });
    console.debug(`[${this.id}] enter CPU state: ${this.stateMachine.current}`);
  };
}

export default Cpu;
