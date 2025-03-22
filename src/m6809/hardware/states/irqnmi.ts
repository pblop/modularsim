import { ConditionCodes } from "../../util/cpu_parts.js";
import { IRQNMI_STACK_REGISTERS, pushRegisters } from "../../util/instructions/stack.js";
import type { CycleStartFn, CycleEndFn } from "../../util/state_machine.js";

const start: CycleStartFn<"irqnmi"> = (cpuInfo, stateInfo) => {
  const { memoryPending, queryMemoryRead, config, cpu, registers } = cpuInfo;
  const { ctx, ticksOnState } = stateInfo;

  if (memoryPending) return;

  if (ticksOnState === 0) {
    // Store which interrupt we're handling, and clear the interrupt pending flag.
    if (cpu.pendingNMI) {
      ctx.nmi = true;
      cpu.pendingNMI = false;
    } else if (cpu.pendingIRQ) {
      ctx.irq = true;
      cpu.pendingIRQ = false;
    }
    registers.cc |= ConditionCodes.ENTIRE_FLAG;
  }
  // (using figure 9 as a reference)
  // m-1 is the last cycle of the previous instruction.
  // m is the first cycle of the current instruction ("fetch" for us).
  // m+1 is the second cycle of the current instruction ("irqnmi" cycle 0).
  // that means, that our cycle counter is 1 cycle behind the timing on the
  // figure.
  // The Figure starts pushing the registers onto the stack on m+3, so we start
  // on cycle 2
  else if (ticksOnState >= 2 && ticksOnState <= 13) {
    // We now push the registers onto the S stack, in order PC, U, Y, X, DP, B, A, CC,
    // which is the same thing a PSHS PC,U,Y,X,DP,B,A,CC would do.
    const pushedAllRegisters = pushRegisters(
      cpuInfo,
      "S",
      IRQNMI_STACK_REGISTERS,
      ctx,
      "pushedRegisters",
    );
    if (!pushedAllRegisters && ticksOnState === 13) {
      throw new Error("[cpu] Pushing registers due to interrupt took too long.");
    }
  } //else if (ticksOnState === 14) {
  // cycle 14 (m+15) is a VMA cycle, which is not relevant for us.
  //}
  else if (ticksOnState === 15) {
    // On cycle 15 (m+16), we fetch the first byte of the interrupt vector.
    // On cycle 16 (m+17) we fetch the second byte (automatically done by queryMemoryRead).
    if (ctx.nmi) {
      registers.cc |= ConditionCodes.FIRQ_MASK | ConditionCodes.IRQ_MASK;
    } else if (ctx.irq) {
      registers.cc |= ConditionCodes.IRQ_MASK;
    }
    const vector = ctx.nmi ? config.nmiVector : config.irqVector;
    queryMemoryRead(vector, 2);
  }
};

const end: CycleEndFn<"irqnmi"> = (
  { cpu, memoryPending, memoryAction, registers, commitRegisters, et },
  { ticksOnState, ctx },
) => {
  if (ticksOnState === 16) {
    // On cycle 16 (m+17), we should have the interrupt vector.
    registers.pc = memoryAction!.valueRead;
  } else if (ticksOnState === 17) {
    // And finally, on cycle 17 (m+18), we have the last VMA cycle, and
    // the last of the interrupt handling state.
    commitRegisters();
    return "fetch";
  }

  return "irqnmi";
};

export default { start, end };
