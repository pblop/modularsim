import { generateCpuOnlySimulator } from "./common";
import type M6809Simulator from "../src/m6809/base.ts";

import { describe, it, expect, beforeEach, afterAll, beforeAll } from "bun:test";

function CycleTester(): (memory: Uint8Array) => Promise<number> {
  return (memory: Uint8Array) => {
    return new Promise((resolve, reject) => {
      const simulator = generateCpuOnlySimulator();
      const et = simulator.asSimulation({ module: "test", secure: false });
      let cycles = 0;
      let finished = false;

      et.on("memory:read", (address: number) => {
        et.emit("memory:read:result", address, memory[address]);
      });
      et.on("memory:write", (address: number, data: number) => {
        if (address === 0xff01) {
          finished = true;
          resolve(cycles);
        } else {
          memory[address] = data;
          et.emit("memory:write:result", address, data);
        }
      });
      et.on("cpu:fail", () => {
        finished = true;
        reject();
      });
      et.on("cpu:reset_finish", () => {
        cycles = 0;
      });
      et.emit("signal:reset");
      while (!finished) {
        cycles++;
        et.performCycle();
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

  it("Hola mundo (1/3)", genCycleTest("hola.bin", 240));
  it("1.asm", genCycleTest("1.bin", 21));
  it("2.asm", genCycleTest("2.bin", 10));
  it("3.asm", genCycleTest("3.bin", 8));
  it("4.asm", genCycleTest("4.bin", 5));
  it("Sumar (2/2)", genCycleTest("sumar.bin", 56));
  it("5.asm", genCycleTest("5.bin", 12));
  it("6.asm", genCycleTest("6.bin", 10));
  it("7.asm", genCycleTest("7.bin", 13));
  it("8.asm", genCycleTest("8.bin", 12));
  it("holalargo.asm", genCycleTest("holalargo.bin", 21252));
});
