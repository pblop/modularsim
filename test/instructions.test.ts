import { generateCpuOnlySimulator } from "./common";
import type M6809Simulator from "../src/m6809/base.ts";

import { describe, expect, test, beforeAll, beforeEach } from "bun:test";
import type { Registers } from "../src/m6809/util/cpu_parts.ts";

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

describe("Instructions", () => {
  let registerTester: (memory: Uint8Array) => Promise<Registers[]>;

  beforeAll(() => {
    registerTester = RegisterTester();
  });

  function genRegisterTest(basefile: string) {
    return async () => {
      const file = Bun.file(`./programs/${basefile}.bin`);
      const testSnapshots = await Bun.file(`./programs/${basefile}.json`).json();

      const contents = await file.bytes();
      const snapshots = await registerTester(contents);

      for (const [index, registers] of snapshots.entries()) {
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

        expect(
          execSnapshot,
          `Cycle ${index} of ${basefile}.s19 is not equal to truth source`,
        ).toEqual(testSnapshot);
      }
    };
  }

  test("9.asm", genRegisterTest("9"));
});
