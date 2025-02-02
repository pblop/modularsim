import { generateCpuOnlySimulator } from "./common";
import type M6809Simulator from "../src/m6809/base.ts";

import { describe, expect, test, beforeAll, beforeEach } from "bun:test";

function CycleTester(): (memory: Uint8Array) => Promise<number> {
  return (memory: Uint8Array) => {
    return new Promise((resolve, reject) => {
      const simulator = generateCpuOnlySimulator();
      let cycles = 0;
      let finished = false;

      simulator.on("memory:read", (address: number) => {
        simulator.emit("memory:read:result", address, memory[address]);
      });
      simulator.on("memory:write", (address: number, data: number) => {
        if (address === 0xff01) {
          console.log("Finished");
          finished = true;
          resolve(cycles);
        } else {
          memory[address] = data;
          simulator.emit("memory:write:result", address, data);
        }
      });
      simulator.on("cpu:fail", () => {
        finished = true;
        reject();
      });
      simulator.on("cpu:reset_finish", () => {
        // The cycle that finishes the reset is already the first IF cycle,
        // so the "actual" cycles start at 1 once the reset finishes.
        cycles = 1;
      });
      simulator.emit("signal:reset");
      while (!finished) {
        cycles++;
        simulator.emit("clock:cycle_start");
      }
    });
  };
}

describe("Cycles", () => {
  let cycleTester: (memory: Uint8Array) => Promise<number>;

  beforeAll(() => {
    cycleTester = CycleTester();
  });

  function genCycleTest(fileName: string, expectedCycles: number) {
    return async () => {
      const file = Bun.file(`./programs/${fileName}`);
      const contents = await file.bytes();
      const cycles = await cycleTester(contents);

      expect(cycles).toBe(expectedCycles);
    };
  }

  test("Hola mundo", genCycleTest("hola.bin", 240));
  test("1.asm", genCycleTest("1.bin", 21));
  test("2.asm", genCycleTest("2.bin", 10));
  test("3.asm", genCycleTest("3.bin", 8));
  test("4.asm", genCycleTest("4.bin", 5));
});
