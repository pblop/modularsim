import { signExtend, numberToIntN, truncate } from "../../../general/numbers.js";
import { parseIndexedPostbyte, IndexedAction } from "../../util/instructions.js";
import type { OnEnterFn, OnExitFn } from "../../util/state_machine";
import { CpuIndexedAddressingData } from "../cpu.js";

const enterIndexedPostbyte: OnEnterFn<"indexed_postbyte"> = (
  { memoryPending, queryMemoryRead },
  { ctx },
) => {
  if (memoryPending) return false;

  // Fetch the indexed postbyte.
  queryMemoryRead("pc", 1);
  return false;
};
const exitIndexedPostbyte: OnExitFn<"indexed_postbyte"> = (
  { memoryPending, memoryAction, cpu },
  { ctx },
) => {
  if (memoryPending) return null;

  // Parse the postbyte.
  const postbyte = memoryAction!.valueRead;
  const parsedPostbyte = parseIndexedPostbyte(postbyte);
  if (!parsedPostbyte) return cpu.fail(`Invalid indexed postbyte ${postbyte.toString(16)}`);

  cpu.addressing = { mode: "indexed", postbyte: parsedPostbyte, address: 0 };

  // Perform instruction execution.
  return "indexed_main";
};

const enterIndexedMain: OnEnterFn<"indexed_main"> = ({ cpu, registers }, { ctx }) => {
  if (cpu.addressing == null || cpu.addressing.mode !== "indexed") {
    cpu.fail("[indexed_main] Invalid addressing mode");
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
    }[cpu.addressing!.postbyte.action];

    ctx.baseAddress = registers[cpu.addressing.postbyte.register];
    ctx.offset = 0; // Default offset is 0 (we will modify it if not 0 in exitIndexedMain)
  }
  return false;
};

type ActionTable = {
  [action in string]?: {
    [cycle: number]: () => unknown;
    logic?: () => unknown;
  };
};

const exitIndexedMain: OnExitFn<"indexed_main"> = (
  { memoryPending, cpu, queryMemoryRead, memoryAction, registers },
  { ctx },
) => {
  if (cpu.addressing == null || cpu.addressing.mode !== "indexed")
    return cpu.fail("Invalid addressing mode");

  if (memoryPending) return null;

  const postbyte = cpu.addressing!.postbyte;

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
      2: () => queryMemoryRead("pc", 1),
      1: dontCare,
    },
    [IndexedAction.Offset16]: {
      5: () => queryMemoryRead("pc", 1),
      4: () => {
        ctx.offset = memoryAction!.valueRead << 8;
        queryMemoryRead("pc", 1);
      },
      3: () => {
        ctx.offset! |= memoryAction!.valueRead;
      },
      2: dontCare,
      1: dontCare,
    },
    [IndexedAction.OffsetA]: {
      2: dontCare,
      1: dontCare,
      logic: () => {
        ctx.offset = signExtend(registers.A, 8, 16);
      },
    },
    [IndexedAction.OffsetB]: {
      2: dontCare,
      1: dontCare,
      logic: () => {
        ctx.offset = signExtend(registers.B, 8, 16);
      },
    },
    [IndexedAction.OffsetD]: {
      5: dontCare,
      4: dontCare,
      3: dontCare,
      2: dontCare,
      1: dontCare,
      logic: () => {
        ctx.offset = registers.D;
      },
    },
    [IndexedAction.PostInc1]: {
      3: dontCare,
      2: dontCare,
      1: dontCare,
      logic: () => {
        registers[postbyte.register]++;
      },
    },
    [IndexedAction.PreDec1]: {
      3: dontCare,
      2: dontCare,
      1: dontCare,
      logic: () => {
        // All valid registers are 16-bit, so we need to sign-extend the -1 to 16 bits.
        registers[postbyte.register] += numberToIntN(-1, 2);
        ctx.baseAddress = registers[postbyte.register];
      },
    },
    [IndexedAction.PostInc2]: {
      4: dontCare,
      3: dontCare,
      2: dontCare,
      1: dontCare,
      logic: () => {
        registers[postbyte.register] += 2;
      },
    },
    [IndexedAction.PreDec2]: {
      4: dontCare,
      3: dontCare,
      2: dontCare,
      1: dontCare,
      logic: () => {
        // All valid registers are 16-bit, so we need to sign-extend the -1 to 16 bits.
        registers[postbyte.register] += numberToIntN(-2, 2);
        ctx.baseAddress = registers[postbyte.register];
      },
    },
    [IndexedAction.OffsetPC16]: {
      6: () => queryMemoryRead("pc", 1),
      5: () => {
        ctx.offset = memoryAction!.valueRead;
        queryMemoryRead("pc", 1);
      },
      4: () => {
        ctx.offset = memoryAction!.valueRead;
      },
      3: dontCare,
      2: dontCare,
      1: dontCare,
    },
    [IndexedAction.ExtendedIndirect]: {
      3: () => queryMemoryRead("pc", 2),
      // During a memory read (queryMemoryRead), the remaining cycle count
      // is not decremented, so we need to do it manually.
      2: () => {
        ctx.baseAddress = memoryAction!.valueRead;
        ctx.offset = 0;
        ctx.remainingTicks--;
      },
      // This will not be called, as we're done after the second (third) cycle.
      1: dontCare,
    },
    [IndexedAction.OffsetPC8]: {
      2: () => queryMemoryRead("pc", 1),
      1: dontCare,
      logic: () => {
        ctx.offset = signExtend(memoryAction!.valueRead, 8, 16);
      },
    },
  };

  const indexdedActionFunctions = actionTable[postbyte.action];
  if (!indexdedActionFunctions) return cpu.fail(`Invalid indexed action ${postbyte.action}`);
  indexdedActionFunctions[ctx.remainingTicks]();
  ctx.remainingTicks--;

  // If we're done waiting however many cycles we needed to wait for this indexed action,
  // we can move on to the next state.
  if (ctx.remainingTicks === 0) {
    indexdedActionFunctions.logic?.();
    cpu.addressing!.address = truncate(ctx.baseAddress + ctx.offset!, 16);
    return "indexed_indirect";
  }

  return null;
};

const enterIndexedIndirect: OnEnterFn<"indexed_indirect"> = (
  { memoryPending, cpu, queryMemoryRead },
  { ctx },
) => {
  if (cpu.addressing == null || cpu.addressing.mode !== "indexed") {
    cpu.fail("[indexed_indirect] Invalid addressing mode");
    return false;
  }

  if (cpu.addressing.postbyte.indirect) {
    if (memoryPending) return false;
    ctx.remainingTicks = 1;

    // If the addressing is indirect, we need to read the memory at the address we calculated.
    queryMemoryRead(cpu.addressing.address, 2);
    return false;
  } else {
    // This state is immediate if the addressing is not indirect (we don't need to read any memory).
    return !cpu.addressing.postbyte.indirect;
  }
};
const exitIndexedIndirect: OnExitFn<"indexed_indirect"> = (
  { memoryPending, cpu, memoryAction },
  { ctx },
) => {
  if (cpu.addressing?.mode !== "indexed") return cpu.fail("Invalid addressing mode");

  if (cpu.addressing.postbyte.indirect) {
    // If the addressing is indirect, we need to read the memory at the address we calculated.
    if (memoryPending) return null;
    if (ctx.remainingTicks === 1) {
      cpu.addressing!.address = memoryAction!.valueRead;
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

export const IndexedPostbyteState = {
  onEnter: enterIndexedPostbyte,
  onExit: exitIndexedPostbyte,
};
export const IndexedMainState = {
  onEnter: enterIndexedMain,
  onExit: exitIndexedMain,
};
export const IndexedIndirectState = {
  onEnter: enterIndexedIndirect,
  onExit: exitIndexedIndirect,
};
