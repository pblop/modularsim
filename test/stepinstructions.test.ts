import { generateCpuOnlySimulator } from "./common.ts";
import type M6809Simulator from "../src/m6809/base.ts";

import { describe, it, expect, test, beforeEach, afterAll, afterEach } from "bun:test";
import { ccToShortStrings, Registers } from "../src/m6809/util/cpu_parts.ts";
import {
  decompileInstruction,
  generateRowData,
  type InstructionRowData,
} from "../src/m6809/util/decompile.ts";
import type { SimulationModuleInteraction } from "../src/types/module.d.ts";

class RegisterTesterClass {
  simulator: M6809Simulator;
  et: SimulationModuleInteraction;
  memory: Uint8Array;
  success: boolean;
  failed: boolean;
  newRegisters: Registers | undefined;

  constructor() {
    this.simulator = generateCpuOnlySimulator();
    this.et = this.simulator.asSimulation({ module: "test", secure: false });
    this.memory = new Uint8Array(0x10000);
    this.success = false;
    this.failed = false;
    this.newRegisters = undefined;

    this.et.on("memory:read", (address: number) => {
      this.et.emit("memory:read:result", address, this.memory[address]);
    });
    this.et.on("memory:write", (address: number, data: number) => {
      if (address === 0xff01) {
        this.success = true;
      } else {
        this.memory[address] = data;
        this.et.emit("memory:write:result", address, data);
      }
    });
    this.et.on("cpu:registers_update", (regs: Registers) => {
      this.newRegisters = regs.copy();
    });
    this.et.on("cpu:fail", () => {
      this.failed = true;
    });
  }

  reset(memory: Uint8Array): Registers {
    this.success = false;
    this.failed = false;
    this.newRegisters = undefined;
    this.memory = memory;
    this.et.emit("signal:reset");

    while (this.newRegisters === undefined) {
      this.et.performCycle();
    }
    const regs = this.newRegisters;
    this.newRegisters = undefined;

    return regs;
  }

  performInstruction() {
    while (this.newRegisters === undefined && !this.success && !this.failed) {
      // Because there are no asynchronous operations in this mock machine, we
      // can safely call performCycle in a loop without awaiting it.
      this.et.performCycle();
    }
    const regs = this.newRegisters;
    this.newRegisters = undefined;

    if (this.success) {
      return {
        error: false,
        done: true,
        registers: regs,
      };
    } else if (this.failed) {
      return {
        error: true,
        done: true,
        registers: regs,
      };
    } else {
      return {
        error: false,
        done: false,
        registers: regs,
      };
    }
  }
}

type SnapshotType = {
  a: number;
  b: number;
  x: number;
  y: number;
  u: number;
  s: number;
  dp: number;
  cc: number;
  pc: number;
};

async function generateDecompilation(
  memory: Uint8Array,
  address: number,
  registers: Registers,
): Promise<string> {
  const decompiled = await decompileInstruction(
    async (addr, bytes = 1) =>
      memory.slice(addr, addr + bytes).reduce((acc, val) => (acc << 8) | val, 0),
    registers,
    registers.pc,
  );
  const decompiledRowData = generateRowData(decompiled, (addr) =>
    addr.toString(16).padStart(4, "0"),
  ) as InstructionRowData;

  return decompiledRowData.data;
}

function snapshotToHumanReadable(regObject: Record<string, unknown>) {
  // Sort the keys so that the output is consistent.
  const keys = Object.keys(regObject).sort();
  regObject = Object.fromEntries(keys.map((key) => [key, regObject[key]]));

  const num = (address: number, bytes = 2) => address.toString(16).padStart(bytes, "0");
  let output = "";
  for (const [key, value] of Object.entries(regObject)) {
    if (key === "cc") {
      const ccString = ccToShortStrings(value as number, true)
        .map((x) => (x.length === 0 ? "_" : x))
        .join("");
      output += `cc: ${num(value as number)} (${ccString}) `;
    } else {
      const bytes = ["dp", "a", "b"].includes(key) ? 2 : 4;
      output += `${key}: ${num(value as number, bytes)} `;
    }
  }
  return output;
}
function registersToSnapshot(registers: Registers): SnapshotType {
  return {
    dp: registers.dp,
    cc: registers.cc,
    a: registers.A,
    b: registers.B,
    x: registers.X,
    y: registers.Y,
    u: registers.U,
    s: registers.S,
    pc: registers.pc,
  };
}

async function generateSnapshotName(
  previousRegisters: Record<string, number> | undefined,
  memory: Uint8Array,
) {
  if (previousRegisters === undefined) {
    return "<reset>";
  } else {
    const regs = new Registers();
    regs.dp = previousRegisters.dp;
    regs.cc = previousRegisters.cc;
    regs.A = previousRegisters.a;
    regs.B = previousRegisters.b;
    regs.X = previousRegisters.x;
    regs.Y = previousRegisters.y;
    regs.U = previousRegisters.u;
    regs.S = previousRegisters.s;
    regs.pc = previousRegisters.pc;
    return await generateDecompilation(memory, previousRegisters.pc, regs);
  }
}

function generateDescribe(basefile: string) {
  return async () => {
    const file = Bun.file(`./programs/${basefile}.bin`);
    const testSnapshots = await Bun.file(`./programs/${basefile}.json`).json();

    const registerTester = new RegisterTesterClass();
    const contents = await file.bytes();

    // Get all snapshots except the last one, which contains the PC following
    // the final instruction.
    const resetregisters = registerTester.reset(contents);

    // Global variables to know the test status in the afterEach function.
    let currentSnapshot: number;
    let testStatus: boolean | undefined;
    let skipTests = false;
    const actualSnapshots: SnapshotType[] = [];

    for (let i = 0; i < testSnapshots.length; i++) {
      const snapshotName = await generateSnapshotName(testSnapshots[i - 1], contents);
      it(`${i}: ${snapshotName}`, () => {
        if (skipTests) {
          expect(true, "Skip").toBeFalsy();
          return;
        }
        currentSnapshot = i;
        testStatus = false;

        let error: boolean;
        let done: boolean;
        let registers: Registers;
        if (i === 0) {
          error = false;
          done = false;
          registers = resetregisters;
        } else {
          const returnValue = registerTester.performInstruction();
          error = returnValue.error;
          done = returnValue.done;
          registers = returnValue.registers!;
        }
        expect(error, "an error ocurred").toBeFalsy();
        // expect(done, "the program didn't finish when it should've").toBe(
        //   i === testSnapshots.length - 1,
        // );

        const expected = testSnapshots[i];
        const actual = registersToSnapshot(registers!);
        actualSnapshots.push(actual);
        expect(actual, "the registers didn't match the expected values").toEqual(expected);

        testStatus = true;
      });
    }
    it(`${testSnapshots.length}: <final>`, () => {
      if (skipTests) {
        expect(true, "Skip").toBeFalsy();
        return;
      }
      const final = registerTester.performInstruction();
      expect(final.error, "an error ocurred").toBeFalsy();
      expect(final.done, "the program didn't finish when it should've").toBe(true);
    });

    afterEach(() => {
      if (!testStatus && !skipTests) {
        const prevValue =
          currentSnapshot > 0
            ? snapshotToHumanReadable(actualSnapshots[currentSnapshot - 1])
            : "<no previous snapshot>";
        const currValue = snapshotToHumanReadable(actualSnapshots[currentSnapshot]);
        const prevExpected =
          currentSnapshot > 0
            ? snapshotToHumanReadable(testSnapshots[currentSnapshot - 1])
            : "<no previous snapshot>";
        const currExpected = snapshotToHumanReadable(testSnapshots[currentSnapshot]);
        console.error(`Previous value of registers         : ${prevValue}`);
        console.error(`Previous expected value of registers: ${prevExpected}`);
        console.error(`Current value of registers          : ${currValue}`);
        console.error(`Current expected value of registers : ${currExpected}`);

        skipTests = true;
      }
    });
  };
}

describe("subroutines.asm", generateDescribe("subroutines"));
describe("recumples.asm", generateDescribe("recumples"));
