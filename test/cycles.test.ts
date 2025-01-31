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
      simulator.emit("signal:reset");
      while (!finished) {
        simulator.emit("clock:cycle_start");
        cycles++;
      }
    });
  };
}

describe("Cycles", () => {
  let cycleTester: (memory: Uint8Array) => Promise<number>;

  beforeAll(() => {
    cycleTester = CycleTester();
  });

  test("Hola mundo", async () => {
    const file = Bun.file("./test/programs/hola.bin");
    const contents = await file.bytes();
    const cycles = await cycleTester(contents);

    expect(cycles).toBe(240);
  });
});
