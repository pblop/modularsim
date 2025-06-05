// import {
//   type AllInstructionRowData,
//   type DecompiledInstruction,
//   decompileInstruction,
//   eqDecompilation,
//   type FailedDecompilation,
//   generateInstructionElement,
//   generateRowData,
//   type InstructionRowData,
// } from "../../util/decompile.js";

// // whether the address was the start of the instruction, the end, or in the middle.
// export type CachedOrigin = "backwards" | "pc" | "forwards";
// export type CachedInstruction = {
//   decompilation: DecompiledInstruction | FailedDecompilation;
//   time: number;
// };
// export class InstructionLog {
//   list: Record<string, CachedInstruction> = {};
//   sortedAddresses: number[] = [];

//   constructor() {
//     this.list = {};
//     this.sortedAddresses = [];
//   }

//   /**
//    * Update the cache with the given data.
//    * @param data The decompiled instruction to update the cache with.
//    * @returns Whether the cache was updated.
//    */
//   update(decomp: DecompiledInstruction | FailedDecompilation, time: number): boolean {
//     const address = decomp.startAddress;
//     const newi: CachedInstruction = {
//       decompilation: decomp,
//       time,
//     };

//     if (this.list[address]) {
//       const current = this.list[address];

//       if (current.time > newi.time) {
//         // If the current instruction is newer, we don't update.
//         return false;
//       } else {
//         // If the current instruction is older, we update.
//         this._modify(address, newi);
//         return true;
//       }
//     } else {
//       // If the address is not in the cache, we add it.
//       this._add(address, newi);
//       return true;
//     }
//   }

//   _getPrevious(address: number): number | undefined {
//     const index = this.sortedAddresses.indexOf(address);

//     if (index === -1) return undefined;
//     return this.sortedAddresses[index - 1];
//   }

//   _add(address: number, instr: CachedInstruction): void {
//     this.list[address] = instr;

//     this.sortedAddresses.push(address);
//     this.sortedAddresses.sort((a, b) => a - b);
//   }
//   _modify(address: number, instr: CachedInstruction): void {
//     this.list[address] = instr;
//   }

//   // _updateOverlappingFor(cachedInstruction: CachedInstruction) {
//   //   const prevAddr = this._getPrevious(cachedInstruction.decompilation.startAddress);
//   //   if (prevAddr === undefined) return;

//   //   const prev = this.list[prevAddr];
//   //   const { decompilation } = prev;
//   //   // Check if the previous instruction is overlapped by the current one.
//   //   if (
//   //     decompilation.startAddress + decompilation.bytes.length >
//   //     cachedInstruction.decompilation.startAddress
//   //   ) {
//   //     // prev.isOverlapped = true;
//   //   }
//   // }

//   /**
//    * Remove the instruction at the given address from the cache, and from the
//    * list of addresses.
//    */
//   _remove(address: number): void {
//     delete this.list[address];
//     this.sortedAddresses = this.sortedAddresses.filter((a) => a !== address);
//   }

//   /**
//    * Returns the addresses of the instructions that contains the given address.
//    * @param address The address to check.
//    * @returns A list of the addresses of the instructions containing the given address.
//    */
//   getInstructionsContaining(address: number): number[] {
//     const containing = [];
//     // We use the fact that the largest instruction is, at most 5 bytes long.
//     // (That being, an extended indirect 10-starting instruction).
//     // (2 bytes for the opcode, 1 byte for the postbyte, 2 bytes for the address)
//     for (let i = 0; i < 5; i++) {
//       const cached = this.list[address - i];
//       if (
//         cached &&
//         address < cached.decompilation.startAddress + cached.decompilation.bytes.length
//       ) {
//         containing.push(cached.decompilation.startAddress);
//       }
//     }
//     return containing;
//   }

//   /**
//    * Returns the address of the instructions that would be overlapped by an
//    * instruction inserted at the given address with the given size.
//    * @param address The address to insert the instruction at.
//    * @param size The size of the instruction to insert.
//    * @returns The addresses of the instructions that will be overlapped by the
//    * instruction inserted at the given address.
//    */
//   getWouldOverlap(address: number, size: number): number[] {
//     const addresses: number[] = [];
//     for (let i = 0; i < size; i++) {
//       if (this.list[address + i]) addresses.push(address + i);
//     }
//     return addresses;
//   }

//   /**
//    * Get the instruction at the given address.
//    * If the instruction is not in the cache, undefined is returned.
//    * This instruction performs cache invalidation if necessary.
//    * @param address The address of the instruction to get.
//    * @returns The instruction at the given address, or undefined if it's not in
//    * the cache.
//    */
//   get(address: number): CachedInstruction | undefined {
//     return this.list[address];
//   }

//   /**
//    * Check if the cache contains an instruction (or failed decompilation) at the
//    * given address.
//    * @param address The address to check.
//    */
//   contains(address: number): boolean {
//     return this.list[address] !== undefined;
//   }

//   // /**
//   //  * Remove the instruction that contains the given address.
//   //  * If the address is not contained by any instruction in the cache, nothing
//   //  * happens.
//   //  */
//   // _removeContaining(address: number): void {
//   //   // The address is not in the cache, now we need to check if the cache is
//   //   // correct.
//   //   // If the previous instruction that's in the cache contains the current
//   //   // address, we probably need to invalidate that.
//   //   const prevAddr = this.getInstructionContaining(address);
//   //   if (prevAddr !== undefined) {
//   //     this._remove(prevAddr);
//   //   }
//   // }

//   clear(): void {
//     this.list = {};
//     this.sortedAddresses = [];
//   }
// }
