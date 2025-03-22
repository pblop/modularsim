import { indexBit, isNegative, truncate, twosComplement } from "../../../general/numbers.js";
import type Cpu from "../../hardware/cpu";
import type { CpuAddressingData } from "../../hardware/cpu";
import { ConditionCodes, REGISTER_SIZE, type Registers } from "../cpu_parts.js";
import {
  type addInstructions as addInstructionsType,
  type ExecuteStateInfo,
  type GeneralAddressingMode,
  type Register,
  type Accumulator,
  retrieveReadAddressing,
  updateConditionCodes,
  queryReadAddressing,
  queryWrite,
} from "../instructions.js";
import type { AnyStateInfo, CpuInfo, CpuState, StateInfo } from "../state_machine";
import type { AllRegisters } from "./loadstore.js";

// These are in the order of the bits in the postbyte (which is the same as the
// order the registers are pulled).
const STACK_BITMASK = ["cc", "A", "B", "dp", "X", "Y", "_", "pc"] as const;
export const IRQNMI_STACK_REGISTERS: AllRegisters[] = STACK_BITMASK.map((x) =>
  x.replace("_", "U"),
).reverse() as AllRegisters[];
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
  regsToPush: AllRegisters[],
  ctx: { [P in K]: number },
  key: K,
): boolean {
  const { memoryPending, queryMemoryWrite, registers } = cpuInfo;

  if (ctx[key] >= regsToPush.length) return true;

  // Otherwise, push the next register.
  const regToPush: AllRegisters = regsToPush[ctx[key]];
  const size = REGISTER_SIZE[regToPush];
  const stackLocation = registers[stackRegister];
  if (regToPush) {
    // We write the register to the stack, but we don't update the stack pointer
    // (because it's automatically updated by the CPU memoryWrite utility).
    // To write the register to the stack, we write it to the stack pointer - 1,
    // that is, the location before the stack pointer, because the stack pointer
    // points to the last location stored in the stack.
    queryMemoryWrite(stackLocation - 1, size, registers[regToPush], stackRegister);

    ctx[key]++;
  }

  return ctx[key] >= regsToPush.length;
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
  const { memoryPending, memoryAction, commitRegisters, registers } = cpuInfo;
  if (memoryPending) return false;

  const instructionCtx = stateInfo.ctx.instructionCtx;

  // If the postbyte is not yet retrieved, retrieve it.
  if (instructionCtx.registers === undefined) {
    const postbyte = retrieveReadAddressing(addressingData, cpuInfo, stateInfo);
    if (postbyte === null) return false;
    instructionCtx.registers = parseStackPostbyte(postbyte, register, "push");
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

  const registers = instructionCtx.registers;
  // We're done if we've pulled all registers.
  if (instructionCtx.i >= registers.length) return;

  // Otherwise, push the next register.
  const regToPull: AllRegisters = registers[instructionCtx.i];
  const size = REGISTER_SIZE[regToPull];
  const stackLocation = cpu.registers[register];
  if (regToPull) {
    // TODO: It would be good to update the stack pointer after the push (maybe
    // in the same fashion as the PC is updated after a read).
    queryMemoryRead(stackLocation, size);

    cpu.registers[register] += size;
    cpu.registers[register] = truncate(cpu.registers[register], 16);
  }
}

function pullEnd(
  register: "U" | "S",
  cpu: Cpu,
  cpuInfo: CpuInfo,
  stateInfo: ExecuteStateInfo,
  addressingData: CpuAddressingData<"immediate">,
): boolean {
  const { memoryPending, memoryAction, commitRegisters, registers } = cpuInfo;
  if (memoryPending) return false;

  const instructionCtx = stateInfo.ctx.instructionCtx;

  // If the postbyte is not yet retrieved, retrieve it.
  if (instructionCtx.registers === undefined) {
    const postbyte = retrieveReadAddressing(addressingData, cpuInfo, stateInfo);
    if (postbyte === null) return false;
    instructionCtx.registers = parseStackPostbyte(postbyte, register, "pull");
  }

  if (stateInfo.ticksOnState < 3) return false;

  if (instructionCtx.i >= instructionCtx.registers.length) return true;

  // We have to update the registers after the each pull.
  const pulledReg: AllRegisters = instructionCtx.registers[instructionCtx.i];
  if (pulledReg) {
    cpu.registers[pulledReg] = memoryAction!.valueRead;

    instructionCtx.i++;
  }

  return false;
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
