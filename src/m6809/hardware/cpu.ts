import type { IModule, ModuleDeclaration } from "../../types/module.js";
import type { ISimulator } from "../../types/simulator.js";
import type { EventDeclaration, TypedEventTransceiver } from "../../types/event.js";
import type { EmptyObject } from "../../types/common.js";
import {
  type AddressingMode,
  IndexedAction,
  type InstructionData,
  INSTRUCTIONS,
  type ParsedIndexedPostbyte,
  parseIndexedPostbyte,
  performInstructionLogic,
} from "../util/instructions.js";
import { Registers, ConditionCodes, REGISTER_SIZE } from "../util/cpu_parts.js";
import {
  type CpuState,
  type OnEnterFn,
  type OnExitFn,
  StateMachine,
} from "../util/state_machine.js";
import {
  compose,
  decompose,
  intNToNumber,
  numberToIntN,
  signExtend,
  truncate,
} from "../../general/numbers.js";
import { isNumber, parseNumber, verify } from "../../general/config.js";

type CpuConfig = {
  resetVector: number;
};

type CpuImmediateAddressingData = {
  mode: "immediate";
  value: number;
};
type CpuDirectAddressingData = {
  mode: "direct";
  address: number;
};
type CpuExtendedAddressingData = {
  mode: "extended";
  address: number;
};
type CpuIndexedAddressingData = {
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
type CpuInherentAddressingData = {
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

type ActionTable = {
  [action in string]?: {
    [cycle: number]: () => unknown;
    logic?: () => unknown;
  };
};

class RWHelper {
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
        permanent: [[this.onCycleStart, { subcycle: 0 }]],
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

  enterFetchOpcode: OnEnterFn<"fetch_opcode"> = ({ readPending }, _) => {
    if (readPending) return undefined;

    // Fetch the opcode.
    this.queryMemoryRead("pc", 1);
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
      ctx.opcode = this.memoryAction!.valueRead;
    } else {
      ctx.opcode = (ctx.opcode << 8) | this.memoryAction!.valueRead;
    }

    // If the opcode is 0x10 or 0x11, we need to fetch another byte. In the docs,
    // it says that if the second byte is 0x10 or 0x11, we need to fetch another
    // byte, but the MC6809 has no 3-byte instructions. I'm following the docs here.
    if (ctx.opcode === 0x10 || ctx.opcode === 0x11) {
      this.queryMemoryRead("pc", 1);
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
        case "indexed":
          return "indexed_postbyte";
        case "relative":
          return "relative";
        case "extended":
          return "extended";
        case "inherent":
          // Inherent instructions don't need any more data, so we can execute
          // them right away.
          this.addressing = { mode: "inherent" };
          return "execute";
        case "direct":
          return "direct";
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
    this.queryMemoryRead("pc", regSize);
  };
  exitImmediate: OnExitFn<"immediate"> = ({ readPending }, _) => {
    if (readPending) return null;

    // We have the immediate value, so we can store it in the addressing info.
    const value = this.memoryAction!.valueRead;
    this.addressing = { mode: "immediate", value };

    // Perform instruction execution.
    return "execute";
  };

  enterExecute: OnEnterFn<"execute"> = (cpuInfo, stateInfo) => {
    if (stateInfo.ctx.isDone === undefined) {
      stateInfo.ctx.isDone = false;
      stateInfo.ctx.instructionCtx = {};
    }

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

  enterIndexedPostbyte: OnEnterFn<"indexed_postbyte"> = ({ readPending }, { ctx }) => {
    if (readPending) return false;

    // Fetch the indexed postbyte.
    this.queryMemoryRead("pc", 1);
    return false;
  };
  exitIndexedPostbyte: OnExitFn<"indexed_postbyte"> = ({ readPending }, { ctx }) => {
    if (readPending) return null;

    // Parse the postbyte.
    const postbyte = this.memoryAction!.valueRead;
    const parsedPostbyte = parseIndexedPostbyte(postbyte);
    if (!parsedPostbyte) return this.fail(`Invalid indexed postbyte ${postbyte.toString(16)}`);

    this.addressing = { mode: "indexed", postbyte: parsedPostbyte, address: 0 };

    // Perform instruction execution.
    return "indexed_main";
  };

  enterIndexedMain: OnEnterFn<"indexed_main"> = ({ readPending }, { ctx }) => {
    if (this.addressing?.mode !== "indexed") {
      this.fail("[indexed_main] Invalid addressing mode");
      return false;
    }

    if (ctx.remainingTicks === undefined) {
      ctx.remainingTicks = {
        [IndexedAction.Offset0]: 1,
        [IndexedAction.Offset5]: 2,
        [IndexedAction.Offset8]: 2,
        [IndexedAction.Offset16]: 5,
        [IndexedAction.OffsetA]: 2,
        [IndexedAction.OffsetB]: 2,
        [IndexedAction.OffsetD]: 5,
        [IndexedAction.PostInc1]: 3,
        [IndexedAction.PreDec1]: 3,
        [IndexedAction.PostInc2]: 4,
        [IndexedAction.PreDec2]: 4,
        [IndexedAction.OffsetPC16]: 6,
        [IndexedAction.ExtendedIndirect]: 3,
        [IndexedAction.OffsetPC8]: 2,
      }[this.addressing!.postbyte.action];

      ctx.baseAddress = this.registers[this.addressing.postbyte.register];
      ctx.offset = 0; // Default offset is 0 (we will modify it if not 0 in exitIndexedMain)
    }
    return false;
  };
  exitIndexedMain: OnExitFn<"indexed_main"> = ({ readPending }, { ctx }) => {
    if (this.addressing?.mode !== "indexed") return this.fail("Invalid addressing mode");

    if (readPending) return null;

    const postbyte = this.addressing.postbyte!;

    const dontCare = () => {};
    // Otherwise, we do whatever we need to do in this state, and decrement the remaining ticks.
    const actionTable: ActionTable = {
      [IndexedAction.Offset0]: {
        1: dontCare,
      },
      [IndexedAction.Offset5]: {
        2: dontCare,
        1: dontCare,
        logic: () => {
          ctx.offset = signExtend(postbyte.rest, 5, 16);
        },
      },
      [IndexedAction.Offset8]: {
        2: () => this.queryMemoryRead("pc", 1),
        1: dontCare,
      },
      [IndexedAction.Offset16]: {
        5: () => this.queryMemoryRead("pc", 1),
        4: () => {
          ctx.offset = this.memoryAction!.valueRead << 8;
          this.queryMemoryRead("pc", 1);
        },
        3: () => {
          ctx.offset! |= this.memoryAction!.valueRead;
        },
        2: dontCare,
        1: dontCare,
      },
      [IndexedAction.OffsetA]: {
        2: dontCare,
        1: dontCare,
        logic: () => {
          ctx.offset = signExtend(this.registers.A, 8, 16);
        },
      },
      [IndexedAction.OffsetB]: {
        2: dontCare,
        1: dontCare,
        logic: () => {
          ctx.offset = signExtend(this.registers.B, 8, 16);
        },
      },
      [IndexedAction.OffsetD]: {
        5: dontCare,
        4: dontCare,
        3: dontCare,
        2: dontCare,
        1: dontCare,
        logic: () => {
          ctx.offset = this.registers.D;
        },
      },
      [IndexedAction.PostInc1]: {
        3: dontCare,
        2: dontCare,
        1: dontCare,
        logic: () => {
          this.registers[postbyte.register]++;
        },
      },
      [IndexedAction.PreDec1]: {
        3: dontCare,
        2: dontCare,
        1: dontCare,
        logic: () => {
          // All valid registers are 16-bit, so we need to sign-extend the -1 to 16 bits.
          this.registers[postbyte.register] += numberToIntN(-1, 2);
          ctx.baseAddress = this.registers[postbyte.register];
        },
      },
      [IndexedAction.PostInc2]: {
        4: dontCare,
        3: dontCare,
        2: dontCare,
        1: dontCare,
        logic: () => {
          this.registers[postbyte.register] += 2;
        },
      },
      [IndexedAction.PreDec2]: {
        4: dontCare,
        3: dontCare,
        2: dontCare,
        1: dontCare,
        logic: () => {
          // All valid registers are 16-bit, so we need to sign-extend the -1 to 16 bits.
          this.registers[postbyte.register] += numberToIntN(-2, 2);
          ctx.baseAddress = this.registers[postbyte.register];
        },
      },
      [IndexedAction.OffsetPC16]: {
        6: () => this.queryMemoryRead("pc", 1),
        5: () => {
          ctx.offset = this.memoryAction!.valueRead;
          this.queryMemoryRead("pc", 1);
        },
        4: () => {
          ctx.offset = this.memoryAction!.valueRead;
        },
        3: dontCare,
        2: dontCare,
        1: dontCare,
      },
      [IndexedAction.ExtendedIndirect]: {
        3: () => this.queryMemoryRead("pc", 2),
        // During a memory read (queryMemoryRead), the remaining cycle count
        // is not decremented, so we need to do it manually.
        2: () => {
          ctx.baseAddress = this.memoryAction!.valueRead;
          ctx.offset = 0;
          ctx.remainingTicks--;
        },
        // This will not be called, as we're done after the second (third) cycle.
        1: dontCare,
      },
      [IndexedAction.OffsetPC8]: {
        2: () => this.queryMemoryRead("pc", 1),
        1: dontCare,
        logic: () => {
          ctx.offset = signExtend(this.memoryAction!.valueRead, 8, 16);
        },
      },
    };

    const indexdedActionFunctions = actionTable[postbyte.action];
    if (!indexdedActionFunctions) return this.fail(`Invalid indexed action ${postbyte.action}`);
    indexdedActionFunctions[ctx.remainingTicks]();
    ctx.remainingTicks--;

    // If we're done waiting however many cycles we needed to wait for this indexed action,
    // we can move on to the next state.
    if (ctx.remainingTicks === 0) {
      indexdedActionFunctions.logic?.();
      this.addressing!.address = truncate(ctx.baseAddress + ctx.offset!, 16);
      return "indexed_indirect";
    }

    return null;
  };

  enterIndexedIndirect: OnEnterFn<"indexed_indirect"> = ({ readPending }, { ctx }) => {
    if (this.addressing?.mode !== "indexed") {
      this.fail("[indexed_indirect] Invalid addressing mode");
      return false;
    }

    if (this.addressing.postbyte.indirect) {
      if (readPending) return false;
      ctx.remainingTicks = 1;

      // If the addressing is indirect, we need to read the memory at the address we calculated.
      this.queryMemoryRead(this.addressing.address, 2);
      return false;
    } else {
      // This state is immediate if the addressing is not indirect (we don't need to read any memory).
      return !this.addressing.postbyte.indirect;
    }
  };
  exitIndexedIndirect: OnExitFn<"indexed_indirect"> = ({ readPending }, { ctx }) => {
    if (this.addressing?.mode !== "indexed") return this.fail("Invalid addressing mode");

    if (this.addressing.postbyte.indirect) {
      // If the addressing is indirect, we need to read the memory at the address we calculated.
      if (readPending) return null;
      if (ctx.remainingTicks === 1) {
        this.addressing!.address = this.memoryAction!.valueRead;
      } else if (ctx.remainingTicks === 0) {
        return "execute";
      }
      ctx.remainingTicks--;
    } else {
      // If the addressing is not indirect, we don't need to do any reading, so we can move on.
      return "execute";
    }

    return null;
  };

  enterRelative: OnEnterFn<"relative"> = ({ readPending }, _) => {
    if (readPending) return false;

    // Fetch the relative value.
    // TODO: Implement LONG branches.
    this.queryMemoryRead("pc", 1);
    return false;
  };
  exitRelative: OnExitFn<"relative"> = ({ readPending }, _) => {
    if (readPending) return null;

    const long = false;
    const offset = long
      ? this.memoryAction!.valueRead
      : signExtend(this.memoryAction!.valueRead, 8, 16);

    this.addressing = {
      mode: "relative",
      long,
      offset,
      address: truncate(this.registers.pc + offset, 16),
    };

    return "execute";
  };

  enterExtended: OnEnterFn<"extended"> = ({ readPending }, { ctx }) => {
    if (ctx.remainingTicks === undefined) ctx.remainingTicks = 1;
    if (readPending) return false;

    if (ctx.remainingTicks === 1) {
      // Fetch the extended address.
      this.queryMemoryRead("pc", 2);
      return false;
    }
  };

  exitExtended: OnExitFn<"extended"> = ({ readPending }, { ctx }) => {
    if (readPending) return null;

    const address = this.memoryAction!.valueRead;
    this.addressing = { mode: "extended", address };

    if (ctx.remainingTicks !== 0) {
      ctx.remainingTicks--;
      return null;
    }

    return "execute";
  };

  enterDirect: OnEnterFn<"direct"> = ({ readPending }, { ctx }) => {
    if (ctx.remainingTicks === undefined) ctx.remainingTicks = 1;
    if (readPending) return false;

    if (ctx.remainingTicks === 1) {
      // Fetch the direct low byte.
      this.queryMemoryRead("pc", 1);
      return false;
    }
  };
  exitDirect: OnExitFn<"direct"> = ({ readPending }, { ctx }) => {
    if (readPending) return null;

    const low = this.memoryAction!.valueRead;
    const address = truncate((this.registers.dp << 8) | low, 16);
    this.addressing = { mode: "direct", address };

    if (ctx.remainingTicks !== 0) {
      ctx.remainingTicks--;
      return null;
    }

    return "execute";
  };

  enterResetting: OnEnterFn<"resetting"> = ({ readPending }, { ticksOnState, ctx }) => {
    if (readPending) return false;

    if (ctx.remainingTicks === 3) {
      // Fetch the reset vector.
      this.queryMemoryRead(this.config.resetVector, 2);
    }
  };
  exitResetting: OnExitFn<"resetting"> = ({ readPending }, { ticksOnState, ctx }) => {
    // This state is a bit special because of it being the "first" one. It
    // doesn't get entered into, so onExit actually gets called before onExit.
    // Doing the reading here and doing it in onEnter are, thus, functionally
    // equivalent (on the first cycle, both onExit and onEnter are called), so
    // I'm doing it on onEnter to be consistent with the other states.
    // That means that we need to set the remainingTicks here, and we need to make
    // sure that we only get the read value after we've read it!
    if (ticksOnState === 0) {
      ctx.remainingTicks = 7; // 7 cycles to reset.
      return null;
    }
    ctx.remainingTicks--;
    if (readPending || ctx.remainingTicks > 0) return null;

    // Clear all registers.
    // Set pc to the value stored at the reset vector.
    this.registers.dp = 0;
    this.registers.cc = 0;
    this.registers.D = 0;
    this.registers.X = 0;
    this.registers.Y = 0;
    this.registers.U = 0;
    this.registers.S = 0;
    this.registers.pc = this.memoryAction!.valueRead;
    this.commitRegisters();

    this.et.emit("cpu:reset_finish");
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
    this.commitRegisters();
    this.et.emit("cpu:instruction_finish");

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
      resetting: {
        onEnter: this.enterResetting,
        onExit: this.exitResetting,
      },
      fetch_opcode: {
        onEnter: this.enterFetchOpcode,
        onExit: this.exitFetchOpcode,
      },
      immediate: {
        onEnter: this.enterImmediate,
        onExit: this.exitImmediate,
      },
      indexed_postbyte: {
        onEnter: this.enterIndexedPostbyte,
        onExit: this.exitIndexedPostbyte,
      },
      indexed_main: {
        onEnter: this.enterIndexedMain,
        onExit: this.exitIndexedMain,
      },
      indexed_indirect: {
        onEnter: this.enterIndexedIndirect,
        onExit: this.exitIndexedIndirect,
      },
      relative: {
        onEnter: this.enterRelative,
        onExit: this.exitRelative,
      },
      extended: {
        onEnter: this.enterExtended,
        onExit: this.exitExtended,
      },
      direct: {
        onEnter: this.enterDirect,
        onExit: this.exitDirect,
      },
      execute: {
        onEnter: this.enterExecute,
        onExit: this.exitExecute,
      },
      fail: {
        onEnter: () => this.et.emit("cpu:fail"),
        onExit: () => null,
      },
    },
    "unreset",
  );

  /**
   * The entry point of the CPU state machine.
   */
  onCycleStart = () => {
    const readPending =
      this.memoryAction != null && this.memoryAction.type === "read" && !this.memoryAction.isDone();
    const writePending =
      this.memoryAction != null &&
      this.memoryAction.type === "write" &&
      !this.memoryAction.isDone();

    console.log(`rp: ${readPending}, wp: ${writePending}`);
    // Memory operations are ubiquitous for all states. We query it if we need
    // it.  Explanation: we expect the memory to take 1 cycle to respond to our
    // read, so we query it at the beginning of the cycle, and we expect the
    // result to be ready at the beginning of the next cycle.
    this.performPendingMemory();

    console.debug(`[${this.id}] exit CPU state: ${this.stateMachine.current}`);
    this.stateMachine.tick({
      readPending,
      writePending,
    });
    console.debug(`[${this.id}] enter CPU state: ${this.stateMachine.current}`);
  };
}

export default Cpu;
