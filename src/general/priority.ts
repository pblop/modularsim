// Using a binary heap to implement a priority queue.
// Based on the implementation in the heaps library, with some modifications.
// https://github.com/gcnew/heaps/blob/master/src/mutable/bin_heap.ts

/**
 * A function that compares two values, returning:
 * - a negative number if x < y
 * - 0 if x == y
 * - a positive number if x > y
 */
type Comparator<T> = (x: T, y: T) => number;
export class PriorityQueue<T> {
  heap: T[];
  private comparator: Comparator<T>;

  constructor(comparator: Comparator<T>);
  constructor(item: T, comparator: Comparator<T>);
  constructor(a: T | Comparator<T>, b?: Comparator<T>) {
    if (b === undefined) {
      // constructor(comparator: Comparator<T>);
      this.heap = [];
      this.comparator = a as Comparator<T>;
    } else {
      this.heap = [a as T];
      this.comparator = b;
    }
  }

  size(): number {
    return this.heap.length;
  }
  isEmpty(): boolean {
    return this.size() === 0;
  }

  peek(): T | undefined {
    return this.heap[0];
  }
  enqueue(value: T) {
    this.heap.push(value);
    this.siftUp();
  }
  dequeue(): T | undefined {
    if (this.heap.length <= 1) {
      return this.heap.pop();
    }

    const retval = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.siftDown();

    return retval;
  }

  private siftUp() {
    let idx = this.heap.length - 1;
    while (idx > 0) {
      const pidx = this.parentIdx(idx);

      // >= 0 means a >= b
      if (this.comparator(this.heap[idx], this.heap[pidx]) >= 0) {
        break;
      }

      this.swap(idx, pidx);
      idx = pidx;
    }
  }

  private siftDown<T>(startIdx = 0) {
    let idx = startIdx;
    while (true) {
      const lidx = this.leftIdx(idx);
      if (lidx >= this.heap.length) {
        break;
      }

      const ridx = this.rightIdx(idx);
      const childIdx =
        ridx < this.heap.length
          ? // < 0 means a < b
            this.comparator(this.heap[lidx], this.heap[ridx]) < 0
            ? lidx
            : ridx
          : lidx;

      // >=0 means a >= b
      if (this.comparator(this.heap[childIdx], this.heap[idx]) >= 0) {
        break;
      }

      this.swap(childIdx, idx);
      idx = childIdx;
    }
  }

  private parentIdx(x: number) {
    return (x - 1) >> 1;
  }

  private leftIdx(x: number) {
    return (x << 1) + 1;
  }

  private rightIdx(x: number) {
    return (x << 1) + 2;
  }

  private swap(idx1: number, idx2: number) {
    const tmp = this.heap[idx1];
    this.heap[idx1] = this.heap[idx2];
    this.heap[idx2] = tmp;
  }
}
