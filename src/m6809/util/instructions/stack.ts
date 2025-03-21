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
import type { CpuInfo, StateInfo } from "../state_machine";
import type { AllRegisters } from "./loadstore.js";

const STACK_BITMASK = ["cc", "A", "B", "dp", "X", "Y", "_", "pc"] as const;
export function parseStackPostbyte(postbyte: number, usedStackRegister: "U" | "S"): AllRegisters[] {
  const registers: AllRegisters[] = [];
  const otherStackRegister = usedStackRegister === "U" ? "S" : "U";
  for (let i = 0; i < 8; i++) {
    if (indexBit(postbyte, i)) {
      const register: AllRegisters = (
        STACK_BITMASK[i] === "_" ? otherStackRegister : STACK_BITMASK[i]
      ) as AllRegisters;
      registers.push(register);
    }
  }
  return registers;
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

  // After the postbyte is retrieved, there are 3 Don't Care cycles.
  if (stateInfo.ticksOnState < 4) return;

  const registers = instructionCtx.registers;
  // We're done if we've pushed all registers.
  if (instructionCtx.i >= registers.length) return;

  // Otherwise, push the next register.
  const regToPush: AllRegisters = registers[instructionCtx.i];
  const size = REGISTER_SIZE[regToPush];
  const stackLocation = cpu.registers[register];
  if (regToPush) {
    // TODO: Multi-byte registers are pushed in little-endian order, so it would
    // be better to perform pushes in the correct order. Maybe add a "pushStack" method
    // to the CPU class?
    // Also, it would be good to update the stack pointer after the push (maybe
    // in the same fashion as the PC is updated after a read).
    queryMemoryWrite(stackLocation - size, size, cpu.registers[regToPush]);

    cpu.registers[register] += twosComplement(size, 16);
    cpu.registers[register] = truncate(cpu.registers[register], 16);

    instructionCtx.i++;
  }
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
    instructionCtx.registers = parseStackPostbyte(postbyte, register);
  }

  if (instructionCtx.i >= instructionCtx.registers.length) return true;
  else return false;
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
    instructionCtx.registers = parseStackPostbyte(postbyte, register);
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
