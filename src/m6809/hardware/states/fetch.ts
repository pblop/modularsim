import { truncate, twosComplement } from "../../../general/numbers.js";
import { INSTRUCTIONS } from "../../util/instructions.js";
import type { CycleStartFn, CycleEndFn } from "../../util/state_machine";

const start: CycleStartFn<"fetch"> = (
  { memoryPending, queryMemoryRead },
  { ctx, ticksOnState },
) => {
  if (memoryPending) return;

  if (ctx.lastByteRead === undefined) {
    queryMemoryRead("pc", 1);
  } else if (ctx.lastByteRead === 0x10 || ctx.lastByteRead === 0x11) {
    queryMemoryRead("pc", 1);
  }
};

const end: CycleEndFn<"fetch"> = (
  { memoryPending, memoryAction, queryMemoryRead, cpu },
  { ctx },
) => {
  // NOTE: Doing the change of state to interrupt within the fetch state means
  // that, just like the real CPU, we will have fetched a memory byte, and will,
  // therefore, discard it.
  // That also means we need to decrement the PC by one, so that the correct
  // value is pushed onto the stack in the event of an interrupt.
  if (cpu.pendingNMI || cpu.pendingFIRQ || cpu.pendingIRQ) {
    cpu.registers.pc = truncate(cpu.registers.pc + twosComplement(1, 16), 16);
  }
  // The priority order is NMI > FIRQ > IRQ.
  if (cpu.pendingNMI) {
    return "irqnmi";
  } else if (cpu.pendingFIRQ) {
    return "firq";
  } else if (cpu.pendingIRQ) {
    return "irqnmi";
  }

  if (memoryPending) return null;

  // Convert the opcode bytes (one or two) to a single u16 containing the
  // whole opcode.
  // The low byte is the last byte read.
  // e.g. 0x10 0xAB -> 0x10AB
  // e.g. 0xAB -> 0xAB
  if (ctx.opcode === undefined) {
    ctx.opcode = memoryAction!.valueRead;
    ctx.lastByteRead = memoryAction!.valueRead;
  } else {
    // $10 $10 $10 $10 has the same effect as a single $10.
    ctx.opcode = truncate((ctx.opcode << 8) | memoryAction!.valueRead, 16);
    ctx.lastByteRead = memoryAction!.valueRead;
  }

  // If the opcode is 0x10 or 0x11, we need to fetch another byte.
  // Page 2  Note, like the 6809, $10 $10 $10 $10 has the same effect as a single $10.
  if (ctx.lastByteRead === 0x10 || ctx.lastByteRead === 0x11) {
    return null;
  } else {
    // We now have the full opcode, so we can store it, and decode it.
    cpu.opcode = ctx.opcode;
    const instruction = INSTRUCTIONS[ctx.opcode];

    if (!instruction) return cpu.fail(`Unknown opcode ${ctx.opcode.toString(16)}`);
    cpu.instruction = instruction;

    switch (instruction.mode) {
      case "immediate":
        cpu.addressing = { mode: "immediate" };
        // If the instruction is a software interrupt, go to the interrupt state.
        if (instruction.extra.swi) return "irqnmi";
        return "execute";
      case "indexed":
        return "indexed_postbyte";
      case "relative":
        return "relative";
      case "extended":
        return "extended";
      case "inherent":
        // Inherent instructions don't need any more data, so we can execute
        // them right away.
        cpu.addressing = { mode: "inherent" };
        return "execute";
      case "direct":
        return "direct";
      default:
        return cpu.fail(`Addressing mode ${instruction.mode} not implemented`);
    }
  }
};

export default { start, end };
