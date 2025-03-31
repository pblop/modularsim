import { isNegative, truncate, twosComplement } from "../../../general/numbers.js";
import type Cpu from "../../hardware/cpu";
import type { CpuAddressingData } from "../../hardware/cpu";
import { ConditionCodes, REGISTER_SIZE, type ShortCCNames, type Registers } from "../cpu_parts.js";
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

/**
 * A function that, given the current value of a register or memory location,
 * returns the new value and the condition code updates for one of the dual
 * instructions
 */
type DualDataFn = (v: number) => [number, { [K in ShortCCNames]?: boolean | number }];
const clr: DualDataFn = (_: number) => {
  return [
    0,
    {
      N: 0,
      Z: 1,
      V: 0,
      C: 0,
    },
  ];
};
const com: DualDataFn = (v: number) => {
  // vp is v' (v prime)
  const vp = truncate(~v, 8);
  return [
    vp,
    {
      N: isNegative(vp, 8),
      Z: vp === 0,
      V: 0,
      C: 1,
    },
  ];
};
const dec: DualDataFn = (v: number) => {
  const vp = truncate(v + twosComplement(1, 8), 8);
  return [
    vp,
    {
      N: isNegative(vp, 8),
      Z: vp === 0,
      V: v === 0x80,
    },
  ];
};
const inc: DualDataFn = (r: number) => {
  const rp = truncate(r + 1, 8);
  return [
    rp,
    {
      N: isNegative(rp, 8),
      Z: rp === 0,
      V: r === 0x7f,
    },
  ];
};
const neg: DualDataFn = (r: number) => {
  const rp = twosComplement(r, 8);
  return [
    rp,
    {
      N: isNegative(rp, 8),
      Z: rp === 0,
      V: r === 0x80,
      C: r !== 0,
    },
  ];
};
const tst: DualDataFn = (r: number) => {
  return [
    r,
    {
      N: isNegative(r, 8),
      Z: r === 0,
      V: 0,
    },
  ];
};

function dualStart(
  cpuInfo: CpuInfo,
  stateInfo: ExecuteStateInfo,
  reg: Accumulator | undefined,
  addr: CpuAddressingData<"inherent" | "direct" | "indexed" | "extended">,
  dualDataFn: DualDataFn,
) {
  // If the addressing mode is inherent, we operate directly on the registers,
  // on the end part.
  if (addr.mode !== "inherent") {
    if (stateInfo.ticksOnState === 0) {
      // 1st cycle: read the value from memory.
      queryReadAddressing(1, addr, cpuInfo, stateInfo);
    } else {
      // 2nd cycle: operate and write the value back to memory.
      const readValue = retrieveReadAddressing(addr, cpuInfo, stateInfo);
      // The readValue cannot be null, because we read 1 byte from memory,
      // which takes 1 cycle.
      const [rp, cc] = dualDataFn(readValue!);
      stateInfo.ctx.instructionCtx.cc = cc;
      queryWrite(1, rp, addr, cpuInfo, stateInfo);
    }
  }
}

function dualEnd(
  { registers }: CpuInfo,
  { ctx: { instructionCtx } }: ExecuteStateInfo,
  reg: Accumulator | undefined,
  addr: CpuAddressingData<"inherent" | "direct" | "indexed" | "extended">,
  dualDataFn: DualDataFn,
): boolean {
  if (addr.mode === "inherent") {
    // Inherent mode: operate directly on the registers.
    const readValue = registers[reg!];
    const [rp, cc] = dualDataFn(readValue);
    registers[reg!] = rp;
    instructionCtx.cc = cc;
  }

  if (!instructionCtx.cc) return false;

  updateConditionCodes(registers, instructionCtx.cc);
  return true;
}

export default function (addInstructions: typeof addInstructionsType) {
  const dualInstructions = [
    // Each of these arrays contains, in order:
    // 1. mnemonic
    // 2. function to call to get the new value and condition codes
    // 3. opcodes (A, B, direct, indexed, extended)
    ["clr{register}", clr, [0x4f, 0x5f, 0x0f, 0x6f, 0x7f]],
    ["com{register}", com, [0x43, 0x53, 0x03, 0x63, 0x73]],
    ["dec{register}", dec, [0x4a, 0x5a, 0x0a, 0x6a, 0x7a]],
    ["inc{register}", inc, [0x4c, 0x5c, 0x0c, 0x6c, 0x7c]],
    ["neg{register}", neg, [0x40, 0x50, 0x00, 0x60, 0x70]],
    ["tst{register}", tst, [0x4d, 0x5d, 0x0d, 0x6d, 0x7d]],
  ] as const;

  for (const [name, dualDataFn, opcodes] of dualInstructions) {
    addInstructions(
      name,
      [
        [opcodes[0], "A", "inherent", "1"],
        [opcodes[1], "B", "inherent", "1"],
        [opcodes[2], undefined, "direct", "6"],
        [opcodes[3], undefined, "indexed", "6+"],
        [opcodes[4], undefined, "extended", "7"],
      ],
      (_, reg, mode, cycles) => ({
        start: (_, cpuInfo, stateInfo, addr, regs) =>
          dualStart(cpuInfo, stateInfo, reg, addr, dualDataFn),
        end: (_, cpuInfo, stateInfo, addr, regs) =>
          dualEnd(cpuInfo, stateInfo, reg, addr, dualDataFn),
      }),
    );
  }
}
