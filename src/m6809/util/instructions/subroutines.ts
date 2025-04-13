import type Cpu from "../../hardware/cpu.js";
import type { CpuAddressingData } from "../../hardware/cpu.js";
import { ConditionCodes, type Registers } from "../cpu_parts.js";
import {
  type ExtraInstructionData,
  queryReadAddressing,
  type ExecuteStateInfo,
  type FunGen,
  type addInstructions as addInstructionsType,
} from "../instructions.js";
import type { CpuInfo, StateInfo } from "../state_machine.js";
import { pullRegisters, pushRegisters } from "./stack.js";

/**
 * Helper function that handles the execution of subroutine branching
 * instructions (BSR, JSR, LBSR).
 */
const branchSubroutine = <R extends "pc", M extends "relative" | "direct" | "extended" | "indexed">(
  mnemonic: string,
  ___: R,
  __: M,
  _: string,
  { isLongBranch }: ExtraInstructionData,
) => {
  // The number of cycles in the instruction before the "pc" is pushed to the
  // stack.
  const cycles = mnemonic === "bsr" ? 3 : mnemonic === "lbsr" ? 4 : 2;
  return {
    start: (
      cpu: Cpu,
      cpuInfo: CpuInfo,
      { ticksOnState, ctx: { instructionCtx } }: ExecuteStateInfo,
      addr: CpuAddressingData<M>,
    ) => {
      if (ticksOnState > cycles) {
        // Store the current PC in the stack (this takes 2 cycles).
        instructionCtx.finishedPush = pushRegisters(
          cpuInfo,
          "S",
          ["pc"],
          instructionCtx,
          "pushedRegisters",
        );
      }
    },
    end: (
      cpu: Cpu,
      { registers }: CpuInfo,
      { ticksOnState, ctx }: ExecuteStateInfo,
      addr: CpuAddressingData<M>,
    ) => {
      // if finishedPush is undefined or false, we're not done yet.
      if (!ctx.instructionCtx.finishedPush) return false;

      registers.pc = addr.address;

      return true;
    },
  };
};

/**
 * Helper function that handles the execution of subroutine branching
 * instructions (BSR, JSR, LBSR).
 */
const rts = <R extends "pc", M extends "inherent">(
  mnemonic: string,
  ___: R,
  __: M,
  _: string,
  { isLongBranch }: ExtraInstructionData,
) => {
  // The number of cycles in the instruction before the "pc" is pushed to the
  // stack.
  const cycles = mnemonic === "bsr" ? 3 : mnemonic === "lbsr" ? 4 : 2;
  return {
    start: (
      cpu: Cpu,
      cpuInfo: CpuInfo,
      stateInfo: ExecuteStateInfo,
      addr: CpuAddressingData<M>,
    ) => {
      const {
        ticksOnState,
        ctx: { instructionCtx },
      } = stateInfo;
      if (ticksOnState < 1) return;

      // Load the current PC from the stack (this takes 2 cycles).
      pullRegisters(cpuInfo, stateInfo, "S", ["pc"], instructionCtx, "pulledRegisters");
    },
    end: (cpu: Cpu, cpuInfo: CpuInfo, stateInfo: ExecuteStateInfo, addr: CpuAddressingData<M>) => {
      const {
        ticksOnState,
        ctx: { instructionCtx },
      } = stateInfo;
      // if finishedPush is undefined or false, we're not done yet.
      if (ticksOnState < 1) return false;

      pullRegisters(cpuInfo, stateInfo, "S", ["pc"], instructionCtx, "pulledRegisters");
      if (ticksOnState < 4) return false;

      return true;
    },
  };
};

export default function (addInstructions: typeof addInstructionsType) {
  addInstructions("bsr", [[0x8d, "pc", "relative", "7"]], branchSubroutine);
  addInstructions("lbsr", [[0x17, "pc", "relative", "9"]], branchSubroutine, {
    isLongBranch: true,
  });
  addInstructions(
    "jsr",
    [
      [0x9d, "pc", "direct", "7"],
      [0xad, "pc", "indexed", "7+"],
      [0xbd, "pc", "extended", "8"],
    ],
    branchSubroutine,
  );

  addInstructions("rts", [[0x39, "pc", "inherent", "5"]], rts);
}
