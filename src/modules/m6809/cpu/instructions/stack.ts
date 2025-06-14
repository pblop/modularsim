import { indexBit, isNegative, truncate, twosComplement } from "../../../../utils/numbers.js";
import type Cpu from "../cpu.js";
import type { CpuAddressingData } from "../cpu.js";
import { ConditionCodes, REGISTER_SIZE, type Registers } from "../cpu_parts.js";
import {
  type Accumulator,
  type ExecuteStateInfo,
  type GeneralAddressingMode,
  type Register,
  type addInstructions as addInstructionsType,
  queryReadAddressing,
  queryWrite,
  retrieveReadAddressing,
  updateConditionCodes,
} from "../instructions.js";
import type { AnyStateInfo, CpuInfo, CpuState, StateInfo } from "../state_machine.js";
import type { AllRegisters } from "./loadstore.js";

// These are in the order of the bits in the postbyte (which is the same as the
// order the registers are pulled).
const STACK_BITMASK = ["cc", "A", "B", "dp", "X", "Y", "_", "pc"] as const;
export const IRQNMI_STACK_REGISTERS: readonly AllRegisters[] = Object.freeze(
  STACK_BITMASK.map((x) => x.replace("_", "U")).reverse() as AllRegisters[],
);
export const FIRQ_NMI_STACK_REGISTERS: readonly AllRegisters[] = Object.freeze(["cc", "pc"]);

/**
 * Calculates the registers that are pushed or pulled from the stack and in
 * what order.
 * @param postbyte The PSH/PUL postbyte.
 * @param usedStackRegister The register that is used as the stack pointer (S or U).
 * @param order Whether the registers are being pushed or pulled.
 * @returns The registers that are pushed or pulled, in the order they are pushed or pulled.
 */
export function parseStackPostbyte(
  postbyte: number,
  usedStackRegister: "U" | "S",
  order: "push" | "pull",
): AllRegisters[] {
  const registers: AllRegisters[] = [];
  const otherStackRegister = usedStackRegister === "U" ? "S" : "U";
  for (let i = 0; i < STACK_BITMASK.length; i++) {
    if (indexBit(postbyte, i)) {
      const register: AllRegisters = (
        STACK_BITMASK[i] === "_" ? otherStackRegister : STACK_BITMASK[i]
      ) as AllRegisters;
      registers.push(register);
    }
  }

  // If we're pulling, the order in which the registers are accessed is reversed.
  if (order === "push") registers.reverse();
  return registers;
}

/**
 * Utility function to push registers onto the stack. This function is meant to
 * be called in the start function of an instruction, every cycle, until all
 * registers have been pushed.
 * @param cpuInfo A CpuInfo object.
 * @param stackRegister The register that is used as the stack pointer (S or U).
 * @param regsToPush The registers to push onto the stack (in the order they are pushed).
 * @param ctx An object to hold the state of the function.
 * @param key The key in the ctx object that holds the state of the function.
 * @returns Whether all the registers have been pushed (or queried to be pushed).
 */
export function pushRegisters<K extends string>(
  cpuInfo: CpuInfo,
  stackRegister: "U" | "S",
  regsToPush: readonly AllRegisters[],
  ctx: { [P in K]: number },
  key: K,
): boolean {
  const { queryMemoryWriteStack, registers } = cpuInfo;

  if (ctx[key] == null) ctx[key] = 0; // Initialize the context if it doesn't exist.

  if (ctx[key] >= regsToPush.length) return true;

  // Otherwise, push the next register.
  const regToPush: AllRegisters = regsToPush[ctx[key]];
  const size = REGISTER_SIZE[regToPush];
  const stackLocation = registers[stackRegister];

  if (stackLocation < size) {
    throw new Error(
      `[cpu] Stack pointer underflow. Stack pointer: ${stackLocation}, size: ${size}`,
    );
  }
  // We write the register to the stack, but we don't update the stack pointer
  // (because it's automatically updated by the CPU memoryWrite utility).
  // To write the register to the stack, we write it to the stack pointer - 1,
  // that is, the location before the stack pointer, because the stack pointer
  // points to the last location stored in the stack.
  queryMemoryWriteStack(stackLocation - 1, size, registers[regToPush], stackRegister);

  ctx[key]++;

  return ctx[key] >= regsToPush.length;
}
/**
 * Utility function to pull registers from the stack. This function is meant to
 * be called in the start _and end_ functions of an instruction, every cycle,
 * until all registers have been pulled.
 * @param cpuInfo A CpuInfo object.
 * @param stateInfo A StateInfo object for the current CPU state.
 * @param stackRegister The register that is used as the stack pointer (S or U).
 * @param regsToPull The registers to pull from the stack (in the order they are pulled).
 * @param ctx An object to hold the state of the function.
 * @param key The key in the ctx object that holds the state of the function.
 * @returns Whether all the registers have been pulled.
 */
export function pullRegisters<K extends string>(
  { memoryPending, queryMemoryReadStack, registers, memoryAction }: CpuInfo,
  { currentPart }: AnyStateInfo,
  stackRegister: "U" | "S",
  regsToPull: readonly AllRegisters[],
  ctx: { [P in K]: number },
  key: K,
): boolean {
  // If we've pulled all the registers, we're done.
  if (ctx[key] >= regsToPull.length) return true;

  if (ctx[key] == null) ctx[key] = 0; // Initialize the context if it doesn't exist.

  // If there's a memory pending, we wait.
  if (memoryPending) return false;

  if (currentPart === "start") {
    // During the start part, we query the memory to read the register.

    // Pull the next register.
    const regToPull: AllRegisters = regsToPull[ctx[key]];
    const size = REGISTER_SIZE[regToPull];
    const stackLocation = registers[stackRegister];

    if (stackLocation > 0xffff - size) {
      throw new Error(
        `[cpu] Stack pointer overflow. Stack pointer: ${stackLocation}, size: ${size}`,
      );
    }

    // NOTE: I removed an if statement here that checked if the regToPull existed,
    // I don't think it was necessary, but I'm leaving this note here just in case.
    queryMemoryReadStack(stackLocation, size);

    // We're not done yet, we need to wait for the read result.
    return false;
  } else {
    // During the end part, we update the registers with the pulled values.
    const pulledReg: AllRegisters = regsToPull[ctx[key]];
    registers[pulledReg] = memoryAction!.valueRead;

    ctx[key]++;

    return ctx[key] >= regsToPull.length;
  }
}

function pushStart(
  register: "U" | "S",
  cpu: Cpu,
  cpuInfo: CpuInfo,
  stateInfo: ExecuteStateInfo,
  addr: CpuAddressingData<"immediate">,
) {
  const { memoryPending, queryMemoryWrite } = cpuInfo;
  if (memoryPending) return;

  const instructionCtx = stateInfo.ctx.instructionCtx;
  if (stateInfo.ticksOnState === 0) {
    instructionCtx.registers = undefined;
    instructionCtx.i = 0;

    // Retrieve the postbyte.
    return queryReadAddressing(1, addr, cpuInfo, stateInfo);
  }

  // After the postbyte is retrieved (1 cycle), there are 3 Don't Care cycles,
  // so the real work starts on the 4th cycle.
  if (stateInfo.ticksOnState < 4) return;

  const registers = instructionCtx.registers;

  instructionCtx.done = pushRegisters(cpuInfo, register, registers, instructionCtx, "i");
}

function pushEnd(
  register: "U" | "S",
  cpu: Cpu,
  cpuInfo: CpuInfo,
  stateInfo: ExecuteStateInfo,
  addressingData: CpuAddressingData<"immediate">,
): boolean {
  const { memoryPending, sendInstructionExtra, memoryAction, commitRegisters, registers } = cpuInfo;
  if (memoryPending) return false;

  const instructionCtx = stateInfo.ctx.instructionCtx;

  // If the postbyte is not yet retrieved, retrieve it.
  if (instructionCtx.registers === undefined) {
    const postbyte = retrieveReadAddressing(addressingData, cpuInfo, stateInfo);
    if (postbyte === null) return false;
    instructionCtx.registers = parseStackPostbyte(postbyte, register, "push");
    sendInstructionExtra({
      instruction: "psh",
      stackRegister: register,
      registers: instructionCtx.registers,
    });
  }

  // All the push logic is done in the start function.
  return instructionCtx.done;
}

function pullStart(
  register: "U" | "S",
  cpu: Cpu,
  cpuInfo: CpuInfo,
  stateInfo: ExecuteStateInfo,
  addr: CpuAddressingData<"immediate">,
) {
  const { memoryPending, queryMemoryRead } = cpuInfo;
  if (memoryPending) return;

  const instructionCtx = stateInfo.ctx.instructionCtx;
  if (stateInfo.ticksOnState === 0) {
    instructionCtx.registers = undefined;
    instructionCtx.i = 0;

    // Retrieve the postbyte.
    return queryReadAddressing(1, addr, cpuInfo, stateInfo);
  }

  // After the postbyte is retrieved, there are 2 Don't Care cycles.
  if (stateInfo.ticksOnState < 3) return;

  if (!instructionCtx.done)
    pullRegisters(cpuInfo, stateInfo, register, instructionCtx.registers!, instructionCtx, "i");
}

function pullEnd(
  register: "U" | "S",
  cpu: Cpu,
  cpuInfo: CpuInfo,
  stateInfo: ExecuteStateInfo,
  addressingData: CpuAddressingData<"immediate">,
): boolean {
  const { memoryPending, sendInstructionExtra, memoryAction, commitRegisters, registers } = cpuInfo;
  if (memoryPending) return false;

  const instructionCtx = stateInfo.ctx.instructionCtx;

  // If the postbyte is not yet retrieved, retrieve it.
  if (instructionCtx.registers === undefined) {
    const postbyte = retrieveReadAddressing(addressingData, cpuInfo, stateInfo);
    if (postbyte === null) return false;
    instructionCtx.registers = parseStackPostbyte(postbyte, register, "pull");
    sendInstructionExtra({
      instruction: "pul",
      stackRegister: register,
      registers: instructionCtx.registers,
    });
  }

  if (stateInfo.ticksOnState < 3) return false;

  return pullRegisters(
    cpuInfo,
    stateInfo,
    register,
    instructionCtx.registers!,
    instructionCtx,
    "i",
  );
}

export default function (addInstructions: typeof addInstructionsType) {
  // PSHS, PSHU
  addInstructions(
    "psh{register}",
    [
      [0x34, "S", "immediate", "1"],
      [0x36, "U", "immediate", "1"],
    ],
    (_, register, ___, ____) => ({
      start: (cpu, cpuInfo, stateInfo, addr, regs) =>
        pushStart(register, cpu, cpuInfo, stateInfo, addr),
      end: (cpu, cpuInfo, stateInfo, addr, regs) =>
        pushEnd(register, cpu, cpuInfo, stateInfo, addr),
    }),
    {
      postbyte: true,
    },
  );

  // PULS, PULU
  addInstructions(
    "pul{register}",
    [
      [0x35, "S", "immediate", "1"],
      [0x37, "U", "immediate", "1"],
    ],
    (_, register, ___, ____) => ({
      start: (cpu, cpuInfo, stateInfo, addr, regs) =>
        pullStart(register, cpu, cpuInfo, stateInfo, addr),
      end: (cpu, cpuInfo, stateInfo, addr, regs) =>
        pullEnd(register, cpu, cpuInfo, stateInfo, addr),
    }),
    { postbyte: true },
  );
}
