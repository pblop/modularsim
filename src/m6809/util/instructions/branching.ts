import type Cpu from "../../hardware/cpu";
import type { CpuAddressingData } from "../../hardware/cpu";
import { ConditionCodes, type Registers } from "../cpu_parts";
import type { addInstructions as addInstructionsType, ExecuteStateInfo } from "../instructions";
import type { CpuInfo } from "../state_machine";

function branching<M extends "relative">(
  cpu: Cpu,
  mnemonic: string,
  { memoryPending }: CpuInfo,
  { ticksOnState, ctx: { instructionCtx } }: ExecuteStateInfo,
  addr: CpuAddressingData<M>,
  regs: Registers,
  condition: (cc: number) => boolean | number,
  isLongBranch: boolean,
): boolean {
  // If this is a long branch, the first cycle we're in "branching" is a DC cycle.
  // If we don't take the branch, we're finished. But if we do, we take another
  // cycle (the first cycle of "branching" in a short branch).

  if (instructionCtx.taken === undefined) instructionCtx.taken = condition(regs.cc);

  // LONG BRANCH LOGIC
  // If the branch is NOT taken, we only take one cycle, and we don't branch, so
  // we're done.
  if (isLongBranch && !instructionCtx.taken) return true;
  // If the branch is taken, we take TWO cycles.
  if (isLongBranch && ticksOnState === 0) return false;

  if (instructionCtx.taken) {
    if (mnemonic === "bsr" || mnemonic === "lbsr") {
      console.error("BSR/LBSR not implemented");
    }
    regs.pc = addr.address;
  }

  return true;
}

export default function (addInstructions: typeof addInstructionsType) {
  addInstructions(
    "beq",
    [[0x27, "pc", "relative", "3"]],
    (_, __, ___, extra) => (cpu, cpuInfo, stateInfo, addr, regs) =>
      branching(
        cpu,
        "beq",
        cpuInfo,
        stateInfo,
        addr,
        regs,
        (cc) => cc & ConditionCodes.ZERO,
        extra.isLongBranch,
      ),
  );
  addInstructions(
    "lbeq",
    [[0x1027, "pc", "relative", "5(6)"]],
    (_, __, ___, extra) => (cpu, cpuInfo, stateInfo, addr, regs) =>
      branching(
        cpu,
        "lbeq",
        cpuInfo,
        stateInfo,
        addr,
        regs,
        (cc) => cc & ConditionCodes.ZERO,
        extra.isLongBranch,
      ),
    { isLongBranch: true },
  );
  addInstructions(
    "bra",
    [[0x20, "pc", "relative", "3"]],
    (_, __, ___, extra) => (cpu, cpuInfo, stateInfo, addr, regs) =>
      branching(cpu, "bra", cpuInfo, stateInfo, addr, regs, () => true, extra.isLongBranch),
  );
  addInstructions(
    "bne",
    [[0x26, "pc", "relative", "3"]],
    (_, __, ___, extra) => (cpu, cpuInfo, stateInfo, addr, regs) =>
      branching(
        cpu,
        "bne",
        cpuInfo,
        stateInfo,
        addr,
        regs,
        (cc) => !(cc & ConditionCodes.ZERO),
        extra.isLongBranch,
      ),
  );
}
