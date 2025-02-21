import type { IModule, ModuleDeclaration } from "../../types/module.js";
import type { TypedEventTransceiver } from "../../types/event.js";
import type {
  AddressingMode,
  InstructionData,
  ParsedIndexedPostbyte,
} from "../util/instructions.js";
import { Registers } from "../util/cpu_parts.js";
import { CpuInfo, type CpuState, StateMachine } from "../util/state_machine.js";
import { compose, decompose } from "../../general/numbers.js";
import { verify } from "../../general/config.js";
import ResettingState from "./states/resetting.js";
import FetchState from "./states/fetch.js";
import FailState from "./states/fail.js";
import ImmediateState from "./states/immediate.js";
import RelativeState from "./states/relative.js";
import ExtendedState from "./states/extended.js";
import DirectState from "./states/direct.js";
import ExecuteState from "./states/execute.js";
import { IndexedPostbyteState, IndexedMainState, IndexedIndirectState } from "./states/indexed.js";

export type CpuConfig = {
  resetVector: number;
};

export type CpuImmediateAddressingData = {
  mode: "immediate";
  value: number;
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
  ) {
    if (bytes < 1 || bytes > 2)
      throw new Error(`[ReadHelper] Invalid number of bytes to r/w: ${bytes}`);
    if (type === "write" && writeValue === undefined)
      throw new Error("[ReadHelper] Value not provided for write operation");
    if (address < 0 || address > 0xffff)
      throw new Error(`[ReadHelper] Invalid address to r/w: ${address}`);

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
      this.transceiver.emit(
        "memory:write",
        this.address + this.bytesDone,
        this.raw[this.bytesDone],
      );
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

  // The current opcode being executed (if any)
  opcode?: number;
  // The current instruction being executed (if already decoded)
  instruction?: InstructionData;
  addressing?: CpuAddressingData<AddressingMode>;

  getModuleDeclaration(): ModuleDeclaration {
    return {
      events: {
        provided: [
          "cpu:instruction_finish",
          "memory:read",
          "memory:write",
          "cpu:register_update",
          "cpu:registers_update",
          "cpu:fail",
          "cpu:reset_finish",
        ],
        required: {
          "signal:reset": this.reset,
          "memory:read:result": this.onMemoryReadResult,
        },
        optional: {},
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
    this.config = verify<CpuConfig>(config, {
      resetVector: { type: "number", required: false, default: 0xfffe },
    });
    this.et = eventTransceiver;

    this._registers = new Registers();
    this.registers = this.getRegistersProxy();

    console.log(`[${this.id}] Module initialized.`);
  }

  getRegistersProxy() {
    return new Proxy<Registers>(this._registers, {
      set: (target, prop, value) => {
        if (prop === "pc") {
          this.et.emit("cpu:register_update", "pc", value);
        }
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
    this.performPendingMemory();
  };
  performPendingMemory = () => {
    if (!this.memoryAction || this.memoryAction.isDone()) return;
    this.memoryAction.perform();
  };
  onMemoryReadResult = (address: number, data: number) => {
    if (!this.memoryAction) return;

    // If the result wasn't put in the memoryAction, it's not the result we
    // want.
    if (!this.memoryAction.putReadResult(address, data)) return;

    if (this.performingPCRead) this.registers.pc++;
  };
  queryMemoryWrite = (address: number, bytes: number, value: number) => {
    this.memoryAction = new RWHelper(this.et, address, bytes, "write", value);
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

  stateMachine: StateMachine = new StateMachine(
    {
      resetting: ResettingState,
      fetch: FetchState,
      immediate: ImmediateState,
      indexed_postbyte: IndexedPostbyteState,
      indexed_main: IndexedMainState,
      indexed_indirect: IndexedIndirectState,
      relative: RelativeState,
      extended: ExtendedState,
      direct: DirectState,
      execute: ExecuteState,
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
    console.log(`[${this.id}] start state: ${this.stateMachine.current}`);
    this.stateMachine.tick("start", cpuInfo);
  };

  onCycleEnd = () => {
    console.log(`[${this.id}] end state: ${this.stateMachine.current}`);
    this.stateMachine.tick("end", this.generateCpuInfo());
  };
}

export default Cpu;
