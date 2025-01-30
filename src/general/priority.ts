// Using a binary heap to implement a priority queue.
// Based on the implementation in the heaps library, with some modifications.
// https://github.com/gcnew/heaps/blob/master/src/mutable/bin_heap.ts

enum Ordering {
  LessThan = -1,
  Equal = 0,
  GreaterThan = 1,
}
type Comparator<T> = (x: T, y: T) => Ordering;
export class PriorityQueue<T> {
  _heap: T[];
  _cmp: Comparator<T>;

  constructor(comparator: Comparator<T>);
  constructor(item: T, comparator: Comparator<T>);
  constructor(a: T | Comparator<T>, b?: Comparator<T>) {
    if (b === undefined) {
      // constructor(comparator: Comparator<T>);
      this._heap = [];
      this._cmp = a as Comparator<T>;
    } else {
      this._heap = [a as T];
      this._cmp = b;
    }
  }

  size(): number {
    return this._heap.length;
  }
  isEmpty(): boolean {
    return this.size() === 0;
  }

  peek(): T | undefined {
    return this._heap[0];
  }
  enqueue(value: T) {
    this._heap.push(value);
    this._siftUp();
  }
  dequeue(): T | undefined {
    if (this._heap.length <= 1) {
      return this._heap.pop();
    }

    const retval = this._heap[0];
    this._heap[0] = this._heap.pop()!;
    this._siftDown();

    return retval;
  }

  _siftUp() {
    let idx = this._heap.length - 1;
    while (idx > 0) {
      const pidx = this._parentIdx(idx);

      if (this._cmp(this._heap[idx], this._heap[pidx]) !== Ordering.LessThan) {
        break;
      }

      this._swap(idx, pidx);
      idx = pidx;
    }
  }

  _siftDown<T>(startIdx = 0) {
    let idx = startIdx;
    while (true) {
      const lidx = this._leftIdx(idx);
      if (lidx >= this._heap.length) {
        break;
      }

      const ridx = this._rightIdx(idx);
      const childIdx =
        ridx < this._heap.length
          ? this._cmp(this._heap[lidx], this._heap[ridx]) === Ordering.LessThan
            ? lidx
            : ridx
          : lidx;

      if (this._cmp(this._heap[childIdx], this._heap[idx]) !== Ordering.LessThan) {
        break;
      }

      this._swap(childIdx, idx);
      idx = childIdx;
    }
  }

  _parentIdx(x: number) {
    return (x - 1) >> 1;
  }

  _leftIdx(x: number) {
    return (x << 1) + 1;
  }

  _rightIdx(x: number) {
    return (x << 1) + 2;
  }

  _swap(idx1: number, idx2: number) {
    const tmp = this._heap[idx1];
    this._heap[idx1] = this._heap[idx2];
    this._heap[idx2] = tmp;
  }
}
