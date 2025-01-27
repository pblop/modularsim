import type { IModule } from "../../types/module.js";
import type { ISimulator } from "../../types/simulator.js";
import type { EventDeclaration, TypedEventTransceiver } from "../../types/event.js";
import {
  AddressingMode,
  type InstructionData,
  INSTRUCTIONS,
  performInstructionLogic,
} from "../util/instructions.js";
import { Registers, ConditionCodes } from "../util/cpu_parts.js";

type CpuConfig = {
  pc: number;
};

function validate_cpu_config(config: Record<string, unknown>): CpuConfig {
  if (typeof config.pc !== "number") throw new Error("[Clock] frequency must be a number");

  return config as CpuConfig;
}

type CpuState = "unreset" | "opcode" | "immediate" | "fail" | "execute";

type CpuImmediateAddressingData = {
  mode: "immediate";
  value: number | null;
};
export type CpuAddressingData = CpuImmediateAddressingData;

export type StateInfo<S extends CpuState> = {
  readPending: boolean;
  writePending: boolean;
  cyclesOnState: number;
  ctx: StateContexts[S];
};
// Returns the next state, or null if self-transition.
type CpuStateFunction<S extends CpuState> = (info: StateInfo<S>) => CpuState | null;

type EmptyObject = Record<string, never>;
type StateContexts = {
  unreset: EmptyObject;
  opcode: { opcode?: number };
  immediate: EmptyObject;
  // I could type this correctly, but it's not worth the effort. Every
  // instruction can have a different context, so it's better to just use any.
  // biome-ignore lint/suspicious/noExplicitAny: <above>
  execute: any;
  fail: EmptyObject;
};

class Cpu implements IModule {
  id: string;
  config: CpuConfig;
  et: TypedEventTransceiver;

  interval_id?: number;

  registers: Registers;

  // Store the last read memory address, and the value read between states.
  readInfo: { address: number; value: number | null } | null = null;
  stateContext: StateContexts[CpuState] | EmptyObject = {};

  // The current opcode being executed (if any)
  opcode?: number;
  // The current instruction being executed (if already decoded)
  instruction?: InstructionData;
  addressing?: CpuAddressingData;

  // The current state of the CPU state machine.
  state: CpuState;
  // The number of cycles spent in the current state (for substates).
  cyclesOnState: number;

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
    this.cyclesOnState = 0;
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

    this.transitionToState(CpuState.OPCODE);
  };

  printRegisters = () => {
    console.table([
      Object.fromEntries(
        Object.entries(this.registers).map(([key, value]) => [key, `$${value.toString(16)}`]),
      ),
    ]);
  };

  queryMemory = (address: number) => {
    this.readInfo = { address, value: null };
    this.et.emit("memory:read", address);
  };
  onMemoryReadResult = (address: number, data: number) => {
    if (!this.readInfo) return;
    // If the address is different, this is another module's read, or a stale
    // read, or something else, but we don't want it either way.
    if (this.readInfo.address !== address) return;

    this.readInfo.value = data;
  };

  fail = (message: string) => {
    console.error(`[${this.id}] ${message}`);
    return CpuState.FAIL;
  };

  // Fetch and decode opcode.
  stateOpcode: CpuStateFunction<"opcode"> = ({ readPending, writePending, cyclesOnState, ctx }) => {
    // If we have a read pending, we can't continue.
    if (readPending) return null;

    if (cyclesOnState === 0) {
      // Fetch the opcode.
      this.queryMemory(this.registers.pc++);
      return null;
    } else {
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
        this.queryMemory(this.registers.pc++);
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
    }
  };

  stateImmediate: CpuStateFunction<"immediate"> = ({
    readPending,
    writePending,
    cyclesOnState,
    ctx,
  }) => {
    // Fetch the immediate value.
    if (cyclesOnState === 0) {
      this.queryMemory(this.registers.pc++);
      return null;
    }

    if (readPending) return null;

    // We have the immediate value, so we can store it in the addressing info.
    const value = this.readInfo!.value!;
    this.addressing = { mode: "immediate", value };

    // Perform instruction execution.
    return "execute";
  };

  stateExecute: CpuStateFunction<"execute"> = (info) => {
    if (this.instruction === undefined) return this.fail("No instruction to execute");
    if (this.addressing === undefined) return this.fail("No addressing mode to execute");

    const done = performInstructionLogic(
      this,
      info,
      this.instruction,
      this.addressing,
      this.registers,
    );

    if (done) {
      this.onInstructionFinish();
      return "opcode";
    } else {
      return null;
    }
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

  states: { [S in CpuState]: CpuStateFunction<S> } = {
    unreset: () => this.fail("CPU is not reset"),
    opcode: this.stateOpcode,
    immediate: this.stateImmediate,
    execute: this.stateExecute,
    fail: () => "fail",
  };

  /**
   * The entry point of the CPU state machine.
   */
  onCycleStart = () => {
    const readPending = this.readInfo != null && this.readInfo.value === null;
    const writePending = false;

    const nextState = this.states[this.state]({
      readPending,
      writePending,
      cyclesOnState: this.cyclesOnState,
      // biome-ignore lint/suspicious/noExplicitAny: This is a type coercion.
      ctx: this.stateContext as any,
    });
    this.cyclesOnState++;

    if (nextState !== this.state && nextState != null) {
      this.transitionToState(nextState);
    }
  };
  transitionToState(state: CpuState) {
    this.state = state;
    this.cyclesOnState = 0;
    this.stateContext = {};
  }
}

export default Cpu;
