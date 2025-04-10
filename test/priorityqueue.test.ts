import { PriorityQueue } from "../src/general/priority.ts";
import type { CycleCallback, FinalListenerPriority } from "../types/cycles.js";
import { describe, expect, it, before } from "bun:test";

const TEST_SIZE = 100000;

describe("OriginalQueue", () => {
  type ClockQueueElement = {
    callback: CycleCallback;
    priority: FinalListenerPriority;
  };
  const cmp = (a: ClockQueueElement, b: ClockQueueElement) =>
    a.priority.cycle - b.priority.cycle || a.priority.subcycle - b.priority.subcycle;
  const queue = new PriorityQueue<ClockQueueElement>(cmp);

  it("should create an empty queue", () => {
    expect(queue.isEmpty()).toBe(true);
    expect(queue.size()).toBe(0);
  });

  it(`add ${TEST_SIZE} random elements`, () => {
    for (let i = 0; i < TEST_SIZE; i++) {
      const priority = {
        cycle: Math.floor(Math.random() * 100),
        subcycle: Math.floor(Math.random() * 100),
      };
      const callback = () => {
        console.log(`callback ${i} executed`);
        return i;
      };
      queue.enqueue({ callback, priority });
    }
    expect(queue.size()).toBe(TEST_SIZE);
  });

  it(`remove ${TEST_SIZE} elements`, () => {
    for (let i = 0; i < TEST_SIZE; i++) {
      const element = queue.dequeue();
      expect(element).not.toBeUndefined();
    }
    expect(queue.isEmpty()).toBe(true);
  });
});

describe("InlinePriorityQueue", () => {
  type ClockQueueElement = {
    callback: CycleCallback;
  } & FinalListenerPriority;
  const cmp = (a: ClockQueueElement, b: ClockQueueElement) =>
    a.cycle - b.cycle || a.subcycle - b.subcycle;
  const queue = new PriorityQueue<ClockQueueElement>(cmp);

  it("should create an empty queue", () => {
    expect(queue.isEmpty()).toBe(true);
    expect(queue.size()).toBe(0);
  });

  it(`add ${TEST_SIZE} random elements`, () => {
    for (let i = 0; i < TEST_SIZE; i++) {
      const callback = () => {
        console.log(`callback ${i} executed`);
        return i;
      };
      const obj = {
        callback,
        cycle: Math.floor(Math.random() * 100),
        subcycle: Math.floor(Math.random() * 100),
      };
      queue.enqueue(obj);
    }
    expect(queue.size()).toBe(TEST_SIZE);
  });

  it(`remove ${TEST_SIZE} elements`, () => {
    for (let i = 0; i < TEST_SIZE; i++) {
      const element = queue.dequeue();
      expect(element).not.toBeUndefined();
    }
    expect(queue.isEmpty()).toBe(true);
  });
});

describe("InlinePriorityQueue", () => {
  type ClockQueueElement = {
    callback: CycleCallback;
  } & FinalListenerPriority;
  const cmp = (a: ClockQueueElement, b: ClockQueueElement) =>
    a.cycle - b.cycle || a.subcycle - b.subcycle;
  const queue = new PriorityQueue<ClockQueueElement>(cmp);

  it("should create an empty queue", () => {
    expect(queue.isEmpty()).toBe(true);
    expect(queue.size()).toBe(0);
  });

  it(`add ${TEST_SIZE} random elements`, () => {
    for (let i = 0; i < TEST_SIZE; i++) {
      const callback = () => {
        console.log(`callback ${i} executed`);
        return i;
      };
      const obj = {
        callback,
        cycle: Math.floor(Math.random() * 100),
        subcycle: Math.floor(Math.random() * 100),
      };
      queue.enqueue(obj);
    }
    expect(queue.size()).toBe(TEST_SIZE);
  });

  it(`remove ${TEST_SIZE} elements`, () => {
    for (let i = 0; i < TEST_SIZE; i++) {
      const element = queue.dequeue();
      expect(element).not.toBeUndefined();
    }
    expect(queue.isEmpty()).toBe(true);
  });
});

describe("ArrayPriorityQueue", () => {
  type ClockQueueElement = [number, number, CycleCallback];
  const cmp = (a: ClockQueueElement, b: ClockQueueElement) => a[0] - b[0] || a[0] - b[0];
  const queue = new PriorityQueue<ClockQueueElement>(cmp);

  it("should create an empty queue", () => {
    expect(queue.isEmpty()).toBe(true);
    expect(queue.size()).toBe(0);
  });

  it(`add ${TEST_SIZE} random elements`, () => {
    for (let i = 0; i < TEST_SIZE; i++) {
      const callback = () => {
        console.log(`callback ${i} executed`);
        return i;
      };
      queue.enqueue([Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), callback]);
    }
    expect(queue.size()).toBe(TEST_SIZE);
  });

  it(`remove ${TEST_SIZE} elements`, () => {
    for (let i = 0; i < TEST_SIZE; i++) {
      const element = queue.dequeue();
      expect(element).not.toBeUndefined();
    }
    expect(queue.isEmpty()).toBe(true);
  });
});
