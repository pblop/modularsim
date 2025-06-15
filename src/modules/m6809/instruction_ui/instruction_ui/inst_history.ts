import {
  type AllInstructionRowData,
  type DecompiledInstruction,
  type FailedDecompilation,
  type InstructionRowData,
  disassembleInstruction,
  eqDecompilation,
  generateInstructionElement,
  generateRowData,
} from "../../cpu/decompile.js";

const MAX_INSTRUCTION_SIZE = 5;

// whether the address was the start of the instruction, the end, or in the middle.
export type InstructionHistoryEntry = {
  address: number;
  time: number;
  disass: DecompiledInstruction | FailedDecompilation;
  overwritten: boolean;
};
export type ConsecutiveEntryGroup = {
  entries: InstructionHistoryEntry[];
  end: number;
};
export class InstructionHistory {
  list: Record<number, InstructionHistoryEntry[]> = {};
  sortedAddresses: number[] = [];

  constructor() {
    this.list = {};
    this.sortedAddresses = [];
  }

  add(_entry: Omit<InstructionHistoryEntry, "overwritten">): void {
    const entry: InstructionHistoryEntry = { ..._entry, overwritten: false };
    if (!this.list[entry.address]) {
      this.list[entry.address] = [entry];
    } else {
      // If the entry is _already_ in the list, we don't add it again, but we
      // update the time.
      const existing = this.list[entry.address].find((x) =>
        eqDecompilation(x.disass, entry.disass),
      );
      if (existing) {
        existing.time = entry.time;
        return;
      } else {
        this.list[entry.address].push(entry);
      }
    }

    this.addToSortedAddresses(entry.address);
  }

  markOverwritten(address: number): void {
    // If the address is not in the cache, exit
    if (
      address < this.sortedAddresses[0] ||
      address > this.sortedAddresses[this.sortedAddresses.length - 1]
    )
      return;

    // Find the entry that contains the address. We can't guarantee that the
    // address is only contained by one instruction, or that it is only
    // contained by instructions directly preceding or following it. So we
    // must check all instructions in the cache.
    for (const addr of this.sortedAddresses) {
      const entries = this.list[addr];
      for (const entry of entries) {
        const end = entry.address + entry.disass.bytes.length;
        if (entry.address <= address && address < end) {
          entry.overwritten = true;
        }
      }
    }
  }

  private addToSortedAddresses(address: number): void {
    if (this.sortedAddresses.includes(address)) return;
    this.sortedAddresses.push(address);
    this.sortedAddresses.sort((a, b) => a - b);
  }

  get(address: number): InstructionHistoryEntry[] {
    return this.list[address] ?? [];
  }

  /**
   * Retrieves a group of consecutive instructions starting from a specified
   * address. That is, an instruction
   *
   * If the specified address is not the start of an instruction, the function
   * will return an empty array.
   *
   * @param start - The memory address to start retrieving instructions from
   * @param overlapped - Whether to include overlapped instructions in the
   *                     group.
   * @returns An object containing the entries and the end address (the address
   *         immediately after the last instruction in the group).
   */
  getConsecutive(start: number, overlapped = false): ConsecutiveEntryGroup {
    let i = this.sortedAddresses.indexOf(start);
    if (i === -1) return { entries: [], end: start };

    // Group end is the address immediately after the group.
    // In a non-overlapped group, the end of the group is the end of the last
    // instruction in the group.
    // But, in an overlapped group, the end of the group is the end of the
    // instruction that ends last. Example:
    //      AAAA (an instruction)
    //       BB  (an overlapped instruction)
    // Here, end, at the end of the loop would be BB's end. But we want it to
    // be AAAA's end.
    let groupEnd = start;
    const groupEntries = [];
    let end: number;
    let isConsecutive: boolean;
    do {
      const addr = this.sortedAddresses[i];
      const entries: InstructionHistoryEntry[] = this.list[addr];
      groupEntries.push(...entries);
      // NOTE: I'm using the largest length of the bytes to determine the end
      // of the group, but it might be better to use the end of the newest
      // instruction in the group. This is because all instructions but the latest
      // in each address don't exist anymore.
      // I cannot check yet because I don't have a self-overwrite test.
      const largestLength = Math.max(...entries.map((x) => x.disass.bytes.length));
      end = addr + largestLength;
      if (end > groupEnd) groupEnd = end;

      i++;
      isConsecutive =
        i < this.sortedAddresses.length &&
        (overlapped ? end >= this.sortedAddresses[i] : end === this.sortedAddresses[i]);
    } while (isConsecutive);

    return { entries: groupEntries, end: groupEnd };
  }

  getAllConsecutiveEntryGroups(overlapped = false): ConsecutiveEntryGroup[] {
    const groups = [];
    let i = 0;

    while (i !== -1 && i < this.sortedAddresses.length) {
      const group = this.getConsecutive(this.sortedAddresses[i], overlapped);
      groups.push(group);
      i = this.sortedAddresses.findIndex((x) => x >= group.end);
    }
    return groups;
  }

  /**
   * Returns whether the given instruction has been overlapped by another
   * instruction. That is, if part of this instruction is contained in another
   * instruction, and that one is newer.
   * @returns
   */
  isOverlapped(entry: InstructionHistoryEntry) {
    const { address, disass } = entry;
    const end = address + disass.bytes.length;

    for (const addr of this.sortedAddresses) {
      if (addr === address) continue;

      const others = this.list[addr];
      for (const other of others) {
        if (other.time < entry.time) continue;

        const otherEnd = other.address + other.disass.bytes.length;
        // Fully contained, begins during, ends during (or exactly at the same time)
        if (other.address > address && end >= otherEnd) return true;
        // Partially contained, begins before, ends during or after
        if (other.address < address && otherEnd > address) return true;
        // Partially contained, begins during, ends after
        if (other.address > address && other.address < end && otherEnd > end) return true;
      }
    }

    return false;
  }

  isOverwritten(entry: InstructionHistoryEntry): boolean {
    return entry.overwritten;
  }

  clear() {
    this.list = {};
    this.sortedAddresses = [];
  }
}
