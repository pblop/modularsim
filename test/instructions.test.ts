import { generateCpuOnlySimulator } from "./common";
import type M6809Simulator from "../src/m6809/base.ts";

import { describe, it, expect, test, beforeEach, afterAll, afterEach } from "bun:test";
import { ccToShortStrings, type Registers } from "../src/m6809/util/cpu_parts.ts";
import {
  decompileInstruction,
  generateRowData,
  type InstructionRowData,
} from "../src/m6809/util/decompile.ts";

function RegisterTester(): (memory: Uint8Array) => Promise<Registers[]> {
  return (memory: Uint8Array) => {
    return new Promise((resolve, reject) => {
      const simulator = generateCpuOnlySimulator();
      const et = simulator.asSimulation({ module: "test", secure: false });

      const snapshots: Registers[] = [];
      let finished = false;

      et.on("memory:read", (address: number) => {
        et.emit("memory:read:result", address, memory[address]);
      });
      et.on("memory:write", (address: number, data: number) => {
        if (address === 0xff01) {
          finished = true;
          resolve(snapshots);
        } else {
          memory[address] = data;
          et.emit("memory:write:result", address, data);
        }
      });
      et.on("cpu:registers_update", (regs: Registers) => {
        snapshots.push(regs.copy());
      });
      et.on("cpu:fail", () => {
        finished = true;
        reject();
      });
      et.emit("signal:reset");
      while (!finished) {
        // Because there are no asynchronous operations in this mock machine, we
        // can safely call performCycle in a loop without awaiting it.
        et.performCycle();
      }
    });
  };
}

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
function registersToSnapshot(registers: Registers) {
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

// TODO: Use test.each here.
function generateDescribe(basefile: string) {
  return async () => {
    const file = Bun.file(`./programs/${basefile}.bin`);
    const testSnapshots = await Bun.file(`./programs/${basefile}.json`).json();

    const registerTester = RegisterTester();
    const contents = await file.bytes();

    // Get all snapshots except the last one, which contains the PC following
    // the final instruction.
    const regSnapshots = (await registerTester(contents)).slice(0, -1);
    const snapshots = regSnapshots.map(registersToSnapshot);

    // Global variables to know the test status in the afterEach function.
    let currentSnapshot: number;
    let testStatus: boolean | undefined;
    let skipTests = false;

    afterEach(() => {
      if (!testStatus && !skipTests) {
        const prevValue =
          currentSnapshot > 0
            ? snapshotToHumanReadable(registersToSnapshot(regSnapshots[currentSnapshot - 1]))
            : "<no previous snapshot>";
        const currValue = snapshotToHumanReadable(
          registersToSnapshot(regSnapshots[currentSnapshot]),
        );
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

    for (const [index, testSnapshot] of testSnapshots.entries()) {
      if (index >= snapshots.length) {
        it(`${index}: <no snapshot>`, () => {
          expect(true, "<no snapshot>").toBeFalsy();
        });
        continue;
      }

      const execSnapshot = snapshots[index];

      let decompiledInstruction: string;
      if (index === 0) {
        decompiledInstruction = "<reset>";
      } else {
        const previousRegisters = regSnapshots[index - 1];
        decompiledInstruction = await generateDecompilation(
          contents,
          previousRegisters.pc,
          previousRegisters,
        );
      }

      it(`${index}: ${decompiledInstruction}`, () => {
        if (skipTests) {
          expect(true, "Skip").toBeFalsy();
          return;
        }
        currentSnapshot = index;
        testStatus = false;

        expect(execSnapshot).toEqual(testSnapshot);
        testStatus = true;
      });
    }
  };
}

describe("9.asm", generateDescribe("9"));
describe("stack.asm", generateDescribe("stack"));
describe("restar.asm", generateDescribe("restar"));
