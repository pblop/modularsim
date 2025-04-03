import { ConditionCodes } from "../../util/cpu_parts.js";
import {
  FIRQ_NMI_STACK_REGISTERS,
  IRQNMI_STACK_REGISTERS,
  pushRegisters,
} from "../../util/instructions/stack.js";
import type { CycleEndFn, CycleStartFn } from "../../util/state_machine.js";

const start: CycleStartFn<"firq"> = (cpuInfo, stateInfo) => {
  const { memoryPending, registers, queryMemoryRead, config, cpu } = cpuInfo;
  const { ctx, ticksOnState } = stateInfo;

  if (memoryPending) return;

  if (ticksOnState === 0) {
    registers.cc &= ~ConditionCodes.ENTIRE_FLAG;
  }
  // (using figure 10 as a reference)
  // m-1 is the last cycle of the previous instruction.
  // m is the first cycle of the current instruction ("fetch" for us).
  // m+1 is the second cycle of the current instruction ("firq" cycle 0).
  // that means, that our cycle counter is 1 cycle behind the timing on the
  // figure.
  // The Figure starts pushing the registers onto the stack on m+3, so we start
  // on cycle 2, and we end on m+5 (cycle 4).
  else if (ticksOnState >= 2 && ticksOnState <= 4) {
    // We now push the registers onto the S stack, in order PC, CC,
    // which is the same thing a PSHS PC,CC would do.
    const pushedAllRegisters = pushRegisters(
      cpuInfo,
      "S",
      FIRQ_NMI_STACK_REGISTERS,
      ctx,
      "pushedRegisters",
    );
    if (!pushedAllRegisters && ticksOnState === 4) {
      throw new Error("[cpu] Pushing registers due to interrupt took too long.");
    }
  } //else if (ticksOnState === 5) {
  // cycle 5 (m+6) is a VMA cycle, which is not relevant for us.
  //}
  else if (ticksOnState === 6) {
    // On cycle 6 (m+7), we fetch the first byte of the interrupt vector.
    // On cycle 7 (m+8) we fetch the second byte (automatically done by queryMemoryRead).
    registers.cc |= ConditionCodes.FIRQ_MASK | ConditionCodes.IRQ_MASK;
    queryMemoryRead(config.firqVector, 2);
  }
};

const end: CycleEndFn<"firq"> = (
  { cpu, memoryPending, memoryAction, registers, commitRegisters, et },
  { ticksOnState, ctx },
) => {
  if (ticksOnState === 0) {
    // Clear the interrupt pending flag for the interrupt.
    cpu.pendingFIRQ = false;
  } else if (ticksOnState === 7) {
    // On cycle 7 (m+8), we should have the interrupt vector.
    registers.pc = memoryAction!.valueRead;
  } else if (ticksOnState === 8) {
    // And finally, on cycle 8 (m+9), we have the last VMA cycle, and
    // the last of the interrupt handling state.
    commitRegisters();
    return "fetch";
  }

  return "firq";
};

export default { start, end };
