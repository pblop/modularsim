import { ConditionCodes } from "../../util/cpu_parts.js";
import type { CycleStartFn, CycleEndFn } from "../../util/state_machine.js";

const start: CycleStartFn<"irqnmi"> = (
  { memoryPending, queryMemoryRead, config, cpu },
  { ticksOnState, ctx },
) => {
  if (memoryPending) return;

  if (ticksOnState === 0) {
    // We need to know which type of interrupt to handle.
    if (cpu.pendingNMI) {
      ctx.nmi = true;
    } else if (cpu.pendingIRQ) {
      ctx.irq = true;
    }

    // Fetch the interrupt vector.
    queryMemoryRead(ctx.nmi ? config.nmiVector : config.irqVector, 2);
  }
};

const end: CycleEndFn<"irqnmi"> = (
  { cpu, memoryPending, memoryAction, registers, commitRegisters, et },
  { ticksOnState, ctx },
) => {
  // Clear the interrupt pending flag for the interrupt we're handling.
  if (ctx.irq) {
    cpu.pendingIRQ = false;
  } else if (ctx.nmi) {
    cpu.pendingNMI = false;
  }

  return "fetch";
};

export default { start, end };
