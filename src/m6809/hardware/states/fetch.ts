import { INSTRUCTIONS } from "../../util/instructions.js";
import type { CycleStartFn, CycleEndFn } from "../../util/state_machine";

const start: CycleStartFn<"fetch"> = ({ memoryPending, queryMemoryRead }, { ticksOnState }) => {
  if (ticksOnState === 0) {
    // Fetch the opcode.
    queryMemoryRead("pc", 1);
  }
};

const end: CycleEndFn<"fetch"> = (
  { memoryPending, memoryAction, queryMemoryRead, cpu },
  { ctx },
) => {
  if (memoryPending) return null;

  // Convert the opcode bytes (one or two) to a single u16 containing the
  // whole opcode.
  // The low byte is the last byte read.
  // e.g. 0x10 0xAB -> 0x10AB
  // e.g. 0xAB -> 0xAB
  if (ctx.opcode === undefined) {
    ctx.opcode = memoryAction!.valueRead;
  } else {
    ctx.opcode = (ctx.opcode << 8) | memoryAction!.valueRead;
  }

  // If the opcode is 0x10 or 0x11, we need to fetch another byte. In the docs,
  // it says that if the second byte is 0x10 or 0x11, we need to fetch another
  // byte, but the MC6809 has no 3-byte instructions. I'm following the docs here.
  if (ctx.opcode === 0x10 || ctx.opcode === 0x11) {
    queryMemoryRead("pc", 1);
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
