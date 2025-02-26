import {
  type AllInstructionRowData,
  type DecompiledInstruction,
  decompileInstruction,
  eqDecompilation,
  type FailedDecompilation,
  generateInstructionElement,
  generateRowData,
  type InstructionRowData,
} from "../../util/decompile.js";

const MAX_INSTRUCTION_SIZE = 5;

// whether the address was the start of the instruction, the end, or in the middle.
export type InstructionHistoryEntry = {
  address: number;
  time: number;
  disass: DecompiledInstruction | FailedDecompilation;
};
export type ConsecutiveEntryGroup = {
  entries: InstructionHistoryEntry[];
  end: number;
};
export class InstructionHistory {
  list: Record<number, InstructionHistoryEntry> = {};
  sortedAddresses: number[] = [];

  constructor() {
    this.list = {};
    this.sortedAddresses = [];
  }

  add(entry: InstructionHistoryEntry): void {
    this.list[entry.address] = entry;
    this.#addToSortedAddresses(entry.address);
  }

  #addToSortedAddresses(address: number): void {
    if (this.sortedAddresses.includes(address)) return;
    this.sortedAddresses.push(address);
    this.sortedAddresses.sort((a, b) => a - b);
  }

  get(address: number): InstructionHistoryEntry | undefined {
    return this.list[address];
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
    const entries = [];
    let end: number;
    let entry: InstructionHistoryEntry;
    let isConsecutive: boolean;
    do {
      const addr = this.sortedAddresses[i];
      entry = this.list[addr];
      entries.push(entry);
      end = addr + entry.disass.bytes.length;
      if (end > groupEnd) groupEnd = end;

      i++;
      isConsecutive =
        i < this.sortedAddresses.length &&
        (overlapped ? end >= this.sortedAddresses[i] : end === this.sortedAddresses[i]);
    } while (isConsecutive);

    return { entries, end: groupEnd };
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

      const other = this.list[addr];
      if (other.time < entry.time) continue;

      const otherEnd = other.address + other.disass.bytes.length;
      // Fully contained, begins during, ends during (or exactly at the same time)
      if (other.address > address && end >= otherEnd) return true;
      // Partially contained, begins before, ends during or after
      if (other.address < address && otherEnd > address) return true;
      // Partially contained, begins during, ends after
      if (other.address > address && other.address < end && otherEnd > end) return true;
    }

    return false;
  }

  clear() {
    this.list = {};
    this.sortedAddresses = [];
  }
}
