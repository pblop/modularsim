import { generateCpuOnlySimulator } from "./common";
import type M6809Simulator from "../src/m6809/base.ts";

import { describe, it, expect, beforeEach, afterAll, beforeAll } from "bun:test";

function InterruptTester(): (
  memory: Uint8Array,
  signal_name: "irq" | "nmi" | "firq",
) => Promise<[number, number, number]> {
  return (memory: Uint8Array, signal_name: "irq" | "nmi" | "firq") => {
    return new Promise((resolve, reject) => {
      const interrupt_start = 100; // On which cycle to start the interrupt.
      const simulator = generateCpuOnlySimulator();
      const et = simulator.asSimulation({ module: "test", secure: false });
      let cycles = 0;
      let finished = false;
      let interrupt_cycles = 0;
      let interrupt_type = -1;

      et.on("cpu:register_update", (register: string, value: number) => {
        if (register !== "pc") return;
        if (value >= 0x4000 && value < 0x4100) {
          // We are in the interrupt handler.
          interrupt_cycles = cycles - interrupt_start;
        }
      });
      et.on("memory:read", (address: number) => {
        et.emit("memory:read:result", address, memory[address]);
      });
      et.on("memory:write", (address: number, data: number) => {
        if (address >= 0x5000 && address < 0x5010) {
          interrupt_type = address - 0x5000;
          et.emit("memory:write:result", address, data);
        } else if (address === 0xff01) {
          finished = true;
          resolve([cycles, interrupt_cycles, interrupt_type]);
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
        if (cycles === interrupt_start) et.emit(`signal:${signal_name}`);
        et.performCycle();
      }
    });
  };
}

const interruptTester = InterruptTester();
const interruptTestContents = await Bun.file("./programs/interrupt-test.bin").bytes();
// The other I chose in the interrupt-test program.
const routineTypeNum = {
  nmi: 0,
  irq: 1,
  firq: 2,
  swi: 3,
  swi2: 4,
  swi3: 5,
};

const genDescribe = (signalName: "nmi" | "irq" | "firq", expectedSequenceCycles: number) => {
  describe(`The ${signalName.toUpperCase()} signal`, async () => {
    const [cycles, sequenceCycles, interruptType] = await interruptTester(
      interruptTestContents,
      signalName,
    );
    it(`should activate the ${signalName} routine`, () => {
      expect(interruptType).toBe(routineTypeNum[signalName]);
    });
    it(`should take ${expectedSequenceCycles} cycles in the interrupt stacking & vector fetch sequence`, () => {
      expect(sequenceCycles).toBe(expectedSequenceCycles);
    });
  });
};

genDescribe("nmi", 18);
genDescribe("irq", 18);
genDescribe("firq", 9);
