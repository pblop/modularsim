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
    this.sortedAddresses.push(address);
    this.sortedAddresses.sort((a, b) => a - b);
  }

  get(address: number): InstructionHistoryEntry | undefined {
    return this.list[address];
  }

  /**
   * Retrieves a group of consecutive instructions starting from a specified
   * address. In consecutive instructions, the end of one instruction equals
   * the start of the next instruction.
   *
   * If the specified address is not the start of an instruction, the function
   * will return an empty array.
   *
   * @param start - The memory address to start retrieving instructions from
   * @returns An object containing the entries and the end address (the address
   *         immediately after the last instruction in the group).
   */
  getConsecutive(start: number): ConsecutiveEntryGroup {
    let i = this.sortedAddresses.indexOf(start);
    if (i === -1) return { entries: [], end: start };

    const entries = [];
    let end: number;
    let entry: InstructionHistoryEntry;
    do {
      const addr = this.sortedAddresses[i];
      entry = this.list[addr];
      entries.push(entry);
      end = addr + entry.disass.bytes.length;
      i++;
    } while (end === this.sortedAddresses[i] && i < this.sortedAddresses.length);

    return { entries, end };
  }

  getAllConsecutiveEntryGroups(): ConsecutiveEntryGroup[] {
    const groups = [];
    let i = 0;

    while (i !== -1 && i < this.sortedAddresses.length) {
      const group = this.getConsecutive(this.sortedAddresses[i]);
      groups.push(group);
      i = this.sortedAddresses.findIndex((x) => x >= group.end);
    }
    return groups;
  }

  clear() {
    this.list = {};
    this.sortedAddresses = [];
  }
}
