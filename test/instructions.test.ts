import { generateCpuOnlySimulator } from "./common";
import type M6809Simulator from "../src/m6809/base.ts";

import { describe, expect, test, beforeAll, beforeEach } from "bun:test";
import type { Registers } from "../src/m6809/util/cpu_parts.ts";
import {
  decompileInstruction,
  generateRowData,
  InstructionRowData,
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

function generateDescribe(basefile: string) {
  return async () => {
    const file = Bun.file(`./programs/${basefile}.bin`);
    const testSnapshots = await Bun.file(`./programs/${basefile}.json`).json();

    const registerTester = RegisterTester();
    const contents = await file.bytes();
    // Get all snapshots except the last one, which contains the PC following
    // the final instruction.
    const snapshots = (await registerTester(contents)).slice(0, -1);

    for (const [index, registers] of snapshots.entries()) {
      let decompiledInstruction: string;
      if (index === 0) {
        decompiledInstruction = "<reset>";
      } else {
        const previousRegisters = snapshots[index - 1];
        decompiledInstruction = await generateDecompilation(
          contents,
          previousRegisters.pc,
          previousRegisters,
        );
      }

      test(`${index}: ${decompiledInstruction}`, () => {
        const testSnapshot = testSnapshots[index];

        // Generate an object that matches the type of the objects in the testSnapshots array.
        const execSnapshot = {
          dp: registers.dp,
          cc: registers.getShortCCStrings(),
          a: registers.A,
          b: registers.B,
          x: registers.X,
          y: registers.Y,
          u: registers.U,
          s: registers.S,
          pc: registers.pc,
        };

        expect(execSnapshot).toEqual(testSnapshot);
      });
    }
  };
}

describe("9.asm", generateDescribe("9"));
