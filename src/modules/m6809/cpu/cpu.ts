import { verify } from "../../../utils/config.js";
import { compose, decompose, truncate, twosComplement } from "../../../utils/numbers.js";
import type {
  EventDeclarationListeners,
  EventName,
  TypedEventTransceiver,
} from "../../../types/event.js";
import type { IModule, ModuleDeclaration } from "../../../types/module.js";
import { ConditionCodes, Registers } from "./cpu_parts.js";
import type { AddressingMode, InstructionData, ParsedIndexedPostbyte } from "./instructions.js";
import type { AllRegisters } from "./instructions/loadstore.js";
import { type CpuInfo, type CpuState, StateMachine } from "./state_machine.js";
import CustomFnState from "./states/customfn.js";
import DirectState from "./states/direct.js";
import ExecuteState from "./states/execute.js";
import ExtendedState from "./states/extended.js";
import FailState from "./states/fail.js";
import FastIrqState from "./states/fastirq.js";
import FetchState from "./states/fetch.js";
import { IndexedIndirectState, IndexedMainState, IndexedPostbyteState } from "./states/indexed.js";
import IrqNmiState from "./states/irqnmi.js";
import RelativeState from "./states/relative.js";
import ResettingState from "./states/resetting.js";

export type CpuConfig = {
  resetVector: number;
  nmiVector: number;
  irqVector: number;
  firqVector: number;
  swiVector: number;
  swi2Vector: number;
  swi3Vector: number;
  functions: number[];
  immediateUpdateRegisters: Exclude<AllRegisters, "A" | "B">[];
};

export type CpuImmediateAddressingData = {
  mode: "immediate";
};
export type CpuDirectAddressingData = {
  mode: "direct";
  address: number;
};
export type CpuExtendedAddressingData = {
  mode: "extended";
  address: number;
};
export type CpuIndexedAddressingData = {
  mode: "indexed";
  postbyte: ParsedIndexedPostbyte;
  address: number;
};
export type CpuRelativeAddressingData = {
  mode: "relative";
  long: boolean;
  offset: number;
  address: number;
};
export type CpuInherentAddressingData = {
  mode: "inherent";
};

// biome-ignore format: this is easier to read if not biome-formatted
export type CpuAddressingData<M extends AddressingMode> = 
  M extends "immediate" ? CpuImmediateAddressingData : 
  M extends "direct" ? CpuDirectAddressingData : 
  M extends "extended" ? CpuExtendedAddressingData :
  M extends "indexed" ? CpuIndexedAddressingData :
  M extends "relative" ? CpuRelativeAddressingData :
  M extends "inherent" ? CpuInherentAddressingData :
  never;

export class RWHelper {
  raw: number[] = [];
  bytesDone = 0;

  constructor(
    public transceiver: TypedEventTransceiver,
    public address: number,
    public bytes: number,
    public type: "read" | "write",
    public writeValue?: number,
    public backwards = false,
  ) {
    if (bytes < 1 || bytes > 2)
      throw new Error(`[ReadHelper] Invalid number of bytes to r/w: ${bytes}`);
    if (type === "write" && writeValue === undefined)
      throw new Error("[ReadHelper] Value not provided for write operation");
    if (address < 0 || address > 0xffff)
      throw new Error(`[ReadHelper] Invalid address to r/w: ${address}`);
    if (backwards && type === "read") throw new Error("[ReadHelper] Cannot read backwards");

    if (type === "write") this.raw = decompose(writeValue!, bytes);
  }

  putReadResult(address: number, data: number): boolean {
    // If the address is different, this is another module's read, or a stale
    // read, or something else, but we don't want it either way.

    if (this.address + this.bytesDone !== address) return false;
    this.raw.push(data);
    this.bytesDone++;
    return true;
  }
  perform() {
    if (this.type === "read") {
      this.transceiver.emit("memory:read", this.address + this.bytesDone);
    } else {
      // If we're writing backwards, we need to start from the end of the array.
      const address = this.backwards
        ? // If writing backwards, start from the end and count down.
          this.address - this.bytesDone
        : // Otherwise, start from the beginning and count up.
          this.address + this.bytesDone;
      // We need to get the correct byte, depending on whether we're writing
      // backwards or not.
      // It's basically the same ternary as above, but with -1 for the
      // array index.
      const byte = this.backwards
        ? this.raw[this.raw.length - 1 - this.bytesDone]
        : this.raw[this.bytesDone];
      this.transceiver.emit("memory:write", address, byte);
      this.bytesDone++;
    }
  }
  isDone() {
    return this.bytesDone === this.bytes;
  }
  get valueRead() {
    return compose(this.raw);
  }
}

class Cpu implements IModule {
  id: string;
  config: CpuConfig;
  et: TypedEventTransceiver;

  interval_id?: number;

  _registers: Registers;
  registers: Registers;

  // Store the last read memory address, and the value read between states.
  memoryAction: RWHelper | null = null;
  performingPCRead = false;
  // When performing a stack read, we need to know which register to decrement.
  stackRW: "S" | "U" | null = null; // null means we're not reading/writing to/from the stack.

  // The current opcode being executed (if any)
  opcode?: number;
  // The current instruction being executed (if already decoded)
  instruction?: InstructionData;
  addressing?: CpuAddressingData<AddressingMode>;
  // The number of cycles spent on the current instruction.
  cyclesOnInstruction: number;

  pendingIRQ: boolean;
  pendingNMI: boolean;
  pendingFIRQ: boolean;

  receivedFnRegisters?: Registers;

  getModuleDeclaration(): ModuleDeclaration {
    const required: EventDeclarationListeners = {
      "signal:reset": this.reset,
      "memory:read:result": this.onMemoryReadResult,
    };
    if (this.config.functions.length > 0) {
      required["cpu:function:result"] = this.onModuleFunctionResult;
    }
    return {
      events: {
        provided: [
          "cpu:instruction_fetched",
          "cpu:instruction_decoded",
          "cpu:instruction_finish",
          "cpu:instruction_begin",
          "memory:read",
          "memory:write",
          "cpu:register_update",
          "cpu:registers_update",
          "cpu:fail",
          "cpu:reset_finish",
          "cpu:function",
        ],
        required,
        optional: {
          "signal:irq": this.irq,
          "signal:nmi": this.nmi,
          "signal:firq": this.firq,
          "dbg:register_update": this.onExternalRegisterUpdate,
        },
      },
      cycles: {
        permanent: [
          [this.onCycleStart, { subcycle: 0 }],
          [this.onCycleEnd, { subcycle: 100 }],
        ],
      },
    };
  }

  constructor(
    id: string,
    config: Record<string, unknown>,
    eventTransceiver: TypedEventTransceiver,
  ) {
    this.id = id;

    this.config = verify<CpuConfig>(
      config,
      {
        resetVector: { type: "number", required: false, default: 0xfffe },
        nmiVector: { type: "number", required: false, default: 0xfffc },
        swiVector: { type: "number", required: false, default: 0xfffa },
        irqVector: { type: "number", required: false, default: 0xfff8 },
        firqVector: { type: "number", required: false, default: 0xfff6 },
        swi2Vector: { type: "number", required: false, default: 0xfff4 },
        swi3Vector: { type: "number", required: false, default: 0xfff2 },
        functions: {
          type: "array",
          required: false,
          default: [],
          schema: {
            type: "number",
          },
        },
        immediateUpdateRegisters: {
          type: "array",
          required: false,
          // By default, we send updates for stack and pc registers (to allow
          // for better visualization).
          default: ["pc", "S", "U"],
          schema: {
            type: "string",
            enum: ["D", "X", "Y", "U", "S", "pc", "cc", "dp"],
          },
        },
      },
      `[${this.id}] configuration error: `,
    );
    this.et = eventTransceiver;

    this._registers = new Registers();
    this.registers = this.getRegistersProxy();

    this.pendingIRQ = false;
    this.pendingNMI = false;
    this.pendingFIRQ = false;

    this.cyclesOnInstruction = 0;

    console.log(`[${this.id}] Module initialized.`);
  }

  getRegistersProxy() {
    return new Proxy<Registers>(this._registers, {
      set: (target, prop, value) => {
        // If it's not of the same type, naturally, it won't be included in the
        // array!
        // biome-ignore lint/suspicious/noExplicitAny: <above>
        if (typeof prop === "string" && this.config.immediateUpdateRegisters.includes(prop as any))
          // prop must be string if it is in immediateUpdateRegisters.
          this.et.emit("cpu:register_update", prop as string, value);
        target[prop as keyof Registers] = value;
        return true;
      },
    });
  }

  commitRegisters = () => {
    // Object.entries doesn't include the prototype properties (A, B, copy, ...),
    // so we don't need to filter them out.
    const registers = Object.entries(this._registers);
    for (const [key, value] of registers) {
      this.et.emit("cpu:register_update", key, value);
    }
    this.et.emit("cpu:registers_update", this._registers.copy());
  };

  // TODO: The IRQs are not immediate (see Figure 9 of the datasheet, or the very
  // good explanation at https://github.com/cavnex/mc6809/blob/master/documentation/CoreDesign.md#interrupts).
  // That means that, we should only receive them when the CPU is in the second
  // to last state of the instruction.
  // But for now, we're going to receive them whenever they're emitted, because
  // it's easier to implement.
  irq = () => {
    // If the IRQs are masked, don't do anything.
    if (this.registers.cc & ConditionCodes.IRQ_MASK) return;

    this.pendingIRQ = true;
  };
  nmi = () => {
    this.pendingNMI = true;
  };
  firq = () => {
    // If the FIRQs are masked, don't do anything.
    if (this.registers.cc & ConditionCodes.FIRQ_MASK) return;

    this.pendingFIRQ = true;
  };

  swi = (num: number) => {
    return this.fail(`SWI${num} not implemented`);
  };

  onModuleFunctionResult = (pc: number, newRegisters: Registers) => {
    if (pc !== this.registers.pc) return;

    // If the CPU is not in the custom function state, the result will be
    // ignored.
    if (this.stateMachine.current !== "customfn") return;

    this.receivedFnRegisters = newRegisters;
  };
  onExternalRegisterUpdate = (register: string, value: number) => {
    if (!(register in this.registers)) {
      throw new Error(`[${this.id}] Invalid register in register change event: ${register}`);
    } else if (this.cyclesOnInstruction !== 0) {
      throw new Error(
        `[${this.id}] Cannot update register ${register} while executing an instruction`,
      );
    }

    this.registers[register as AllRegisters] = value;
    // If the register IS in the immediateUpdateRegisters list, the event will
    // be emitted by the proxy. If it isn't, we need to emit it ourselves.
    // If it's not of the same type, naturally, it won't be included in the
    // array!
    // biome-ignore lint/suspicious/noExplicitAny: <above>
    if (!this.config.immediateUpdateRegisters.includes(register as any)) {
      this.et.emit("cpu:register_update", register as AllRegisters, value);
    }
  };

  reset = () => {
    // Clear the read and write info from the previous run (if any).
    this.performingPCRead = false;
    this.memoryAction = null;

    this.stateMachine.setState("resetting");
  };

  printRegisters = () => {
    console.table([
      Object.fromEntries(
        Object.entries(this.registers).map(([key, value]) => [key, `$${value.toString(16)}`]),
      ),
    ]);
  };

  queryMemoryRead = (where: number | "pc", bytes: number) => {
    this.memoryAction = new RWHelper(
      this.et,
      where === "pc" ? this.registers.pc : where,
      bytes,
      "read",
    );
    this.performingPCRead = where === "pc";
    this.stackRW = null;
    this.performPendingMemory();
  };
  queryMemoryReadStack = (where: number, bytes: number) => {
    this.memoryAction = new RWHelper(this.et, where, bytes, "read");
    this.stackRW = where === this.registers.S ? "S" : "U";
    this.performingPCRead = false;
    this.performPendingMemory();
  };
  performPendingMemory = () => {
    if (!this.memoryAction || this.memoryAction.isDone()) return;
    this.memoryAction.perform();

    if (this.memoryAction.type === "read" && this.performingPCRead) this.registers.pc++;

    // Update the stack pointer if we're using the stack, to better show
    // the stack pointer being used in the UI.
    if (this.stackRW != null) {
      this.registers[this.stackRW] += this.memoryAction.type === "read" ? 1 : twosComplement(1, 16);
      this.registers[this.stackRW] = truncate(this.registers[this.stackRW], 16);
    }
  };
  onMemoryReadResult = (address: number, data: number) => {
    if (!this.memoryAction) return;

    // If the result wasn't put in the memoryAction, it's not the result we
    // want.
    if (!this.memoryAction.putReadResult(address, data)) return;
  };
  queryMemoryWrite = (address: number, bytes: number, value: number) => {
    this.memoryAction = new RWHelper(this.et, address, bytes, "write", value);
    this.stackRW = null;
    this.performPendingMemory();
  };
  queryMemoryWriteStack = (
    address: number,
    bytes: number,
    value: number,
    stackRegister: "S" | "U",
  ) => {
    this.memoryAction = new RWHelper(this.et, address, bytes, "write", value, true);
    this.stackRW = stackRegister;
    this.performPendingMemory();
  };

  fail = (message: string): CpuState => {
    console.error(`[${this.id}] ${message}`);
    return "fail";
  };

  /**
   * Notify other modules that the instruction has ended, and, as such, our
   * registers have been updated.
   * Also, reset the instruction-related fields, so we can start a new one.
   */
  onInstructionFinish = () => {
    // NOTE: Could be a good idea to modify this to also emit the instruction
    // that was executed, so other modules can react to it.
    this.commitRegisters();
    this.et.emit("cpu:instruction_finish");

    this.opcode = undefined;
    this.instruction = undefined;
    this.addressing = undefined;
  };

  /**
   * Notify other modules that the instruction has been fetched.
   */
  onInstructionFetched = () => {
    if (!this.instruction) return;
    this.et.emit("cpu:instruction_fetched", this.instruction);
  };

  /**
   * Notify other modules that the instruction has been decoded.
   */
  onInstructionDecoded = () => {
    if (!this.instruction || !this.addressing) return;
    this.et.emit("cpu:instruction_decoded", this.instruction, this.addressing);
  };

  stateMachine: StateMachine = new StateMachine(
    {
      resetting: ResettingState,
      fetch: FetchState,
      indexed_postbyte: IndexedPostbyteState,
      indexed_main: IndexedMainState,
      indexed_indirect: IndexedIndirectState,
      relative: RelativeState,
      extended: ExtendedState,
      direct: DirectState,
      execute: ExecuteState,
      irqnmi: IrqNmiState,
      firq: FastIrqState,
      customfn: CustomFnState,
      fail: FailState,
    },
    "fail",
  );

  generateCpuInfo(): CpuInfo {
    const memoryPending = this.memoryAction != null && !this.memoryAction.isDone();
    return {
      memoryPending,
      queryMemoryRead: this.queryMemoryRead,
      queryMemoryWrite: this.queryMemoryWrite,
      queryMemoryReadStack: this.queryMemoryReadStack,
      queryMemoryWriteStack: this.queryMemoryWriteStack,
      config: this.config,
      registers: this.registers,
      memoryAction: this.memoryAction,
      commitRegisters: this.commitRegisters,
      et: this.et,
      cpu: this,
    };
  }

  /**
   * The entry point of the CPU state machine.
   */
  onCycleStart = () => {
    // The CpuInfo object is generated _before_ performing the pending memory
    // operations, so that, in the case that the memoryAction is not done before
    // the pendingMemoryOperation, and the memory module returns INSTANTLY, the
    // memoryPending flag is correctly set to true.
    // If we generated the CpuInfo object _after_ performing the pending memory
    // operations, the memoryPending flag would be set to false, as the memory
    // would have already responded to the read, and as such, the memoryAction
    // would be done, and we would no longer have a pending memory operation.
    const cpuInfo = this.generateCpuInfo();

    // Memory operations are ubiquitous for all states. We query it if we need
    // it.  Explanation: we expect the memory to take 1 cycle to respond to our
    // read, so we query it at the beginning of the cycle, and we expect the
    // result to be ready at the beginning of the next cycle.
    this.performPendingMemory();
    // console.log(`[${this.id}] start state: ${this.stateMachine.current}`);

    if (this.stateMachine.current === "fetch" && this.stateMachine.ticksOnState === 0) {
      this.cyclesOnInstruction = 0;
      // Before beginning the instruction, we need to emit the instruction begin
      // event, so that the UI properly tell that the CPU will not be responding
      // to register change events, or other internal state changes.
      this.et.emit("cpu:instruction_begin", this.registers.pc);

      // Before entering the fetch state for the first time, we need to check if
      // the PC is part of a module function.
      // If it is, we switch to the custom function state.
      if (this.registers.pc in this.config.functions) {
        this.stateMachine.setState("customfn");
        return;
      }
    }

    this.stateMachine.tick("start", cpuInfo);
  };

  onCycleEnd = () => {
    // console.log(`[${this.id}] end state: ${this.stateMachine.current}`);
    this.stateMachine.tick("end", this.generateCpuInfo());
  };
}

export default Cpu;
