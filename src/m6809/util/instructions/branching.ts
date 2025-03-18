import type Cpu from "../../hardware/cpu";
import type { CpuAddressingData } from "../../hardware/cpu";
import { ConditionCodes, type Registers } from "../cpu_parts";
import type {
  addInstructions as addInstructionsType,
  ExecuteStateInfo,
  FunGen,
} from "../instructions";
import type { CpuInfo, StateInfo } from "../state_machine";

/**
 * Generic function that handles the execution of branching instructions (BEQ, BNE, BRA, BSR, etc.),
 * both short and long.
 */
function branching<M extends "relative">(
  mnemonic: string,
  { registers }: CpuInfo,
  { ticksOnState, ctx: { instructionCtx } }: ExecuteStateInfo,
  addr: CpuAddressingData<M>,
  condition: (cc: number) => boolean | number,
  isLongBranch: boolean,
): boolean {
  // If this is a long branch, the first cycle we're in "branching" is a DC cycle.
  // If we don't take the branch, we're finished. But if we do, we take another
  // cycle (the first cycle of "branching" in a short branch).

  if (instructionCtx.taken === undefined) instructionCtx.taken = condition(registers.cc);

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
    registers.pc = addr.address;
  }

  return true;
}

export default function (addInstructions: typeof addInstructionsType) {
  // All the branching instructions have the same pattern:
  // - short branches take 3 cycles
  // - long branches take 5(6) cycles
  // And the short branches are $XX, and the long branches are $10XX,
  // except for BRA ($20) and LBRA ($16).
  const pattern: [string, number, (cc: number) => boolean | number][] = [
    // Even though LBRA is $16, the 6809 will execute $1020 as an LBRA, so this
    // function will also add $1020 as an LBRA.
    ["bra", 0x20, () => true],
    ["brn", 0x21, () => false],
    ["bhi", 0x22, (cc) => !(cc & ConditionCodes.ZERO) && !(cc & ConditionCodes.CARRY)],
    ["bls", 0x23, (cc) => cc & ConditionCodes.ZERO || cc & ConditionCodes.CARRY],
    // NOTE: BHS and BCC are the same instruction, I use BHS because it was first
    // in the list.
    ["bhs", 0x24, (cc) => !(cc & ConditionCodes.CARRY)],
    // NOTE: BLO and BCS are the same instruction.
    ["blo", 0x25, (cc) => cc & ConditionCodes.CARRY],
    ["bne", 0x26, (cc) => !(cc & ConditionCodes.ZERO)],
    ["beq", 0x27, (cc) => cc & ConditionCodes.ZERO],
    ["bvc", 0x28, (cc) => !(cc & ConditionCodes.OVERFLOW)],
    ["bvs", 0x29, (cc) => cc & ConditionCodes.OVERFLOW],
    ["bpl", 0x2a, (cc) => !(cc & ConditionCodes.NEGATIVE)],
    ["bmi", 0x2b, (cc) => cc & ConditionCodes.NEGATIVE],
    ["bge", 0x2c, (cc) => (cc & ConditionCodes.NEGATIVE) === (cc & ConditionCodes.OVERFLOW)],
    ["blt", 0x2d, (cc) => (cc & ConditionCodes.NEGATIVE) !== (cc & ConditionCodes.OVERFLOW)],
    [
      "bgt",
      0x2e,
      (cc) =>
        (cc & ConditionCodes.ZERO) === (cc & ConditionCodes.OVERFLOW) &&
        !(cc & ConditionCodes.ZERO),
    ],
    [
      "ble",
      0x2f,
      (cc) =>
        (cc & ConditionCodes.ZERO) !== (cc & ConditionCodes.OVERFLOW) || cc & ConditionCodes.ZERO,
    ],
    ["lbra", 0x16, () => true],
  ];

  for (const [mnemonic, opcode, condition] of pattern) {
    const funGen: FunGen<"pc", "relative"> =
      (mnem, _, __, ___, extra) => (_, cpuInfo, stateInfo, addr, __) =>
        branching(mnem, cpuInfo, stateInfo, addr, condition, extra.isLongBranch);

    if (mnemonic.startsWith("b")) {
      // Add the short version of the instruction.
      addInstructions(mnemonic, [[opcode, "pc", "relative", "3"]], funGen);
    }

    // In the case of LBRA, the instruction is already long, so I keep its
    // mnemonic and opcode (0x16) as is.
    const mnemonicLong = mnemonic.startsWith("l") ? mnemonic : `l${mnemonic}`;
    const opcodeLong = mnemonic.startsWith("l") ? opcode : 0x1000 | opcode;

    // Add the long version of the instruction.
    addInstructions(mnemonicLong, [[opcodeLong, "pc", "relative", "5(6)"]], funGen, {
      isLongBranch: true,
    });
  }
}
