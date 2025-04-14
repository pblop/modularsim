import type { DecompiledInstruction, FailedDecompilation } from "../../cpu/decompile.js";

export class InstructionCache {
  private cache: Map<number, DecompiledInstruction | FailedDecompilation>;

  private firstAddress: number;
  private lastAddress: number;

  constructor(
    private generator: (address: number) => Promise<DecompiledInstruction | FailedDecompilation>,
  ) {
    this.cache = new Map();
    this.firstAddress = 0;
    this.lastAddress = 0;
  }
  async getOrGenerate(address: number): Promise<DecompiledInstruction | FailedDecompilation> {
    if (!this.cache.has(address)) {
      const instr = await this.generator(address);
      this.set(address, instr);
      return instr;
    }

    return this.cache.get(address)!;
  }
  get(address: number) {
    return this.cache.get(address);
  }
  set(address: number, instruction: DecompiledInstruction | FailedDecompilation) {
    this.cache.set(address, instruction);
    this.firstAddress = Math.min(this.firstAddress, address);
    this.lastAddress = Math.max(this.lastAddress, address + instruction.bytes.length);
  }

  invalidate(address: number) {
    if (address < this.firstAddress || address > this.lastAddress) return;

    // Find any instructions that contain this address and remove them.
    // I cannot guarantee that a given address is only contained by one instruction,
    // or that it is only contained by instructions directly preceding or following it.
    // So I must check all instructions in the cache.
    for (const [addr, instr] of this.cache) {
      if (addr <= address && address < addr + instr.bytes.length) {
        this.cache.delete(addr);
      }
    }
  }

  clear() {
    this.cache.clear();
    this.firstAddress = 0;
    this.lastAddress = 0;
  }
}
