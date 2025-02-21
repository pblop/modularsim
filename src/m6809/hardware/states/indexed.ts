import { signExtend, numberToIntN, truncate } from "../../../general/numbers.js";
import { parseIndexedPostbyte, IndexedAction } from "../../util/instructions.js";
import type {
  CycleStartFn,
  CycleEndFn,
  StateInfo,
  CpuState,
  CpuInfo,
} from "../../util/state_machine";
import type { CpuIndexedAddressingData } from "../cpu.js";

const startIndexedPostbyte: CycleStartFn<"indexed_postbyte"> = (
  { memoryPending, queryMemoryRead },
  { ctx },
) => {
  if (memoryPending) return false;

  // Fetch the indexed postbyte.
  queryMemoryRead("pc", 1);
  return false;
};
const endIndexedPostbyte: CycleEndFn<"indexed_postbyte"> = (
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

type ActionTable<S extends CpuState> = {
  [action in string]?: {
    [cycle: number]: (cpuInfo: CpuInfo, stateInfo: StateInfo<S>) => unknown;
    logic?: (cpuInfo: CpuInfo, stateInfo: StateInfo<S>) => unknown;
  };
};
const dontCare = () => {};

const indexedMainActionTable: ActionTable<"indexed_main"> = {
  [IndexedAction.Offset0]: {
    1: dontCare,
  },
  [IndexedAction.Offset5]: {
    2: dontCare,
    1: dontCare,
    logic: ({ cpu }, { ctx }) => {
      const postbyte = (cpu.addressing! as CpuIndexedAddressingData).postbyte;
      ctx.offset = signExtend(postbyte.rest, 5, 16);
    },
  },
  [IndexedAction.Offset8]: {
    2: ({ queryMemoryRead }) => queryMemoryRead("pc", 1),
    1: dontCare,
  },
  [IndexedAction.Offset16]: {
    5: ({ queryMemoryRead }) => queryMemoryRead("pc", 1),
    4: ({ queryMemoryRead, memoryAction }, { ctx }) => {
      ctx.offset = memoryAction!.valueRead << 8;
      queryMemoryRead("pc", 1);
    },
    3: ({ memoryAction }, { ctx }) => {
      ctx.offset! |= memoryAction!.valueRead;
    },
    2: dontCare,
    1: dontCare,
  },
  [IndexedAction.OffsetA]: {
    2: dontCare,
    1: dontCare,
    logic: ({ registers }, { ctx }) => {
      ctx.offset = signExtend(registers.A, 8, 16);
    },
  },
  [IndexedAction.OffsetB]: {
    2: dontCare,
    1: dontCare,
    logic: ({ registers }, { ctx }) => {
      ctx.offset = signExtend(registers.B, 8, 16);
    },
  },
  [IndexedAction.OffsetD]: {
    5: dontCare,
    4: dontCare,
    3: dontCare,
    2: dontCare,
    1: dontCare,
    logic: ({ registers }, { ctx }) => {
      ctx.offset = registers.D;
    },
  },
  [IndexedAction.PostInc1]: {
    3: dontCare,
    2: dontCare,
    1: dontCare,
    logic: ({ registers, cpu }) => {
      const postbyte = (cpu.addressing! as CpuIndexedAddressingData).postbyte;
      registers[postbyte.register]++;
    },
  },
  [IndexedAction.PreDec1]: {
    3: dontCare,
    2: dontCare,
    1: dontCare,
    logic: ({ registers, cpu }, { ctx }) => {
      const postbyte = (cpu.addressing! as CpuIndexedAddressingData).postbyte;

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
    logic: ({ registers, cpu }) => {
      const postbyte = (cpu.addressing! as CpuIndexedAddressingData).postbyte;
      registers[postbyte.register] += 2;
    },
  },
  [IndexedAction.PreDec2]: {
    4: dontCare,
    3: dontCare,
    2: dontCare,
    1: dontCare,
    logic: ({ registers, cpu }, { ctx }) => {
      const postbyte = (cpu.addressing! as CpuIndexedAddressingData).postbyte;
      // All valid registers are 16-bit, so we need to sign-extend the -1 to 16 bits.
      registers[postbyte.register] += numberToIntN(-2, 2);
      ctx.baseAddress = registers[postbyte.register];
    },
  },
  [IndexedAction.OffsetPC16]: {
    6: ({ queryMemoryRead }) => queryMemoryRead("pc", 1),
    5: ({ queryMemoryRead, memoryAction }, { ctx }) => {
      ctx.offset = memoryAction!.valueRead;
      queryMemoryRead("pc", 1);
    },
    4: ({ memoryAction }, { ctx }) => {
      ctx.offset = memoryAction!.valueRead;
    },
    3: dontCare,
    2: dontCare,
    1: dontCare,
  },
  [IndexedAction.ExtendedIndirect]: {
    3: ({ queryMemoryRead }) => queryMemoryRead("pc", 2),
    // During a memory read (queryMemoryRead), the remaining cycle count
    // is not decremented, so we need to do it manually.
    2: ({ memoryAction }, { ctx }) => {
      ctx.baseAddress = memoryAction!.valueRead;
      ctx.offset = 0;
      ctx.remainingTicks--;
    },
    // This will not be called, as we're done after the second (third) cycle.
    1: dontCare,
  },
  [IndexedAction.OffsetPC8]: {
    2: ({ queryMemoryRead }) => queryMemoryRead("pc", 1),
    1: dontCare,
    logic: ({ memoryAction }, { ctx }) => {
      ctx.offset = signExtend(memoryAction!.valueRead, 8, 16);
    },
  },
};

const startIndexedMain: CycleStartFn<"indexed_main"> = (cpuInfo, stateInfo) => {
  const { cpu, registers } = cpuInfo;
  const { ctx } = stateInfo;

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
    ctx.offset = 0; // Default offset is 0 (we will modify it if not 0 in endIndexedMain)
  }

  // We do whatever we need to do in this state and decrement the remaining ticks.
  const indexdedActionFunctions = indexedMainActionTable[cpu.addressing.postbyte.action];
  if (!indexdedActionFunctions) {
    cpu.fail(`Invalid indexed action ${cpu.addressing.postbyte.action}`);
    return true;
  }
  indexdedActionFunctions[ctx.remainingTicks](cpuInfo, stateInfo);
  ctx.remainingTicks--;
  return false;
};

const endIndexedMain: CycleEndFn<"indexed_main"> = (cpuInfo, stateInfo) => {
  const { memoryPending, cpu, queryMemoryRead, memoryAction, registers } = cpuInfo;
  const { ctx } = stateInfo;

  if (cpu.addressing == null || cpu.addressing.mode !== "indexed")
    return cpu.fail("Invalid addressing mode");

  if (memoryPending) return null;

  const postbyte = cpu.addressing!.postbyte;

  const indexdedActionFunctions = indexedMainActionTable[postbyte.action];
  if (!indexdedActionFunctions) return cpu.fail(`Invalid indexed action ${postbyte.action}`);

  // If we're done waiting however many cycles we needed to wait for this indexed action,
  // we can move on to the next state.
  if (ctx.remainingTicks === 0) {
    indexdedActionFunctions.logic?.(cpuInfo, stateInfo);
    cpu.addressing!.address = truncate(ctx.baseAddress + ctx.offset!, 16);
    return "indexed_indirect";
  }

  return null;
};

const startIndexedIndirect: CycleStartFn<"indexed_indirect"> = (
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
const endIndexedIndirect: CycleEndFn<"indexed_indirect"> = (
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
  start: startIndexedPostbyte,
  end: endIndexedPostbyte,
};
export const IndexedMainState = {
  start: startIndexedMain,
  end: endIndexedMain,
};
export const IndexedIndirectState = {
  start: startIndexedIndirect,
  end: endIndexedIndirect,
};
