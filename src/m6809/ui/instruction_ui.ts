import type { IModule, ModuleDeclaration } from "../../types/module.js";
import type { EventDeclaration, TypedEventTransceiver } from "../../types/event.js";
import type { Registers } from "../util/cpu_parts.js";
import { element } from "../../general/html.js";
import {
  type AllInstructionRowData,
  type DecompiledInstruction,
  decompileInstruction,
  eqDecompilation,
  type FailedDecompilation,
  generateInstructionElement,
  generateRowData,
  type InstructionRowData,
} from "../util/decompile.js";
import { verify } from "../../general/config.js";

type InstructionUIConfig = {
  lines: number;
};

class InstructionCache {
  cache: Record<number, DecompiledInstruction | FailedDecompilation> = {};
  sortedAddresses: number[] = [];

  /**
   * Update the cache with the given data.
   * @param data The decompiled instruction to update the cache with.
   * @returns Whether the cache was updated.
   */
  update(data: DecompiledInstruction | FailedDecompilation): boolean {
    const address = data.startAddress;

    if (this.cache[address]) {
      // If this address is already in the cache, and the data is the same, we
      // don't need to do anything.
      if (eqDecompilation(this.cache[address], data)) return false;
      // But if it's different, we need to remove the previous instruction,
      // and add the new one.
      else {
        // We remove the previous instruction here, and add the new one later.
        this._remove(address);
      }
    } else {
      // If this address is not in the cache per se, we need to check if it's
      // contained by an instruction in the cache. If it's not, we can just add
      // it, otherwise, we need to remove the previous instruction.
      this._removeContaining(address);
    }

    // We need to remove the instructions that will be overlapped by the new
    // instruction.
    const overlapping = this.getWouldOverlap(address, data.bytes.length);
    for (const addr of overlapping) {
      this._remove(addr);
    }

    this.cache[address] = data;
    this.sortedAddresses.push(address);
    this.sortedAddresses.sort((a, b) => a - b);
    return true;
  }

  /**
   * Remove the instruction at the given address from the cache, and from the
   * list of addresses.
   */
  _remove(address: number): void {
    delete this.cache[address];
    this.sortedAddresses = this.sortedAddresses.filter((a) => a !== address);
  }

  /**
   * Returns the address of the instruction that contains the given address.
   * If the address is not contained by any instruction in the cache, it returns
   * undefined.
   * @param address The address to check.
   * @returns The address of the instruction containing the given address.
   */
  getInstructionContaining(address: number): number | undefined {
    // We use the fact that the largest instruction is, at most 5 bytes long.
    // (That being, an extended indirect 10-starting instruction).
    // (2 bytes for the opcode, 1 byte for the postbyte, 2 bytes for the address)
    for (let i = 0; i < 5; i++) {
      const cached = this.cache[address - i];
      if (cached) {
        if (address < cached.startAddress + cached.bytes.length) return cached.startAddress;
        else return undefined;
      }
    }
    return undefined;
  }

  /**
   * Returns the address of the instructions that would be overlapped by an
   * instruction inserted at the given address with the given size.
   * @param address The address to insert the instruction at.
   * @param size The size of the instruction to insert.
   * @returns The addresses of the instructions that will be overlapped by the
   * instruction inserted at the given address.
   */
  getWouldOverlap(address: number, size: number): number[] {
    const addresses: number[] = [];
    for (let i = 0; i < size; i++) {
      if (this.cache[address + i]) addresses.push(address + i);
    }
    return addresses;
  }

  /**
   * Get the instruction at the given address.
   * If the instruction is not in the cache, undefined is returned.
   * This instruction performs cache invalidation if necessary.
   * @param address The address of the instruction to get.
   * @returns The instruction at the given address, or undefined if it's not in
   * the cache.
   */
  get(address: number): DecompiledInstruction | FailedDecompilation | undefined {
    return this.cache[address];
  }

  /**
   * Check if the cache contains an instruction (or failed decompilation) at the
   * given address.
   * @param address The address to check.
   */
  contains(address: number): boolean {
    return this.cache[address] !== undefined;
  }

  /**
   * Remove the instruction that contains the given address.
   * If the address is not contained by any instruction in the cache, nothing
   * happens.
   */
  _removeContaining(address: number): void {
    // The address is not in the cache, now we need to check if the cache is
    // correct.
    // If the previous instruction that's in the cache contains the current
    // address, we probably need to invalidate that.
    const prevAddr = this.getInstructionContaining(address);
    if (prevAddr !== undefined) {
      this._remove(prevAddr);
    }
  }

  clear(): void {
    this.cache = {};
    this.sortedAddresses = [];
  }
}

class InstructionUI implements IModule {
  et: TypedEventTransceiver;
  id: string;

  config: InstructionUIConfig;

  registers?: Registers;

  panel?: HTMLElement;

  getModuleDeclaration(): ModuleDeclaration {
    return {
      events: {
        provided: ["ui:memory:read"],
        required: {
          "ui:memory:read:result": null,
          "gui:panel_created": this.onGuiPanelCreated,
          "cpu:registers_update": this.onRegistersUpdate,
          "signal:reset": this.onReset,
        },
        optional: {},
      },
    };
  }

  constructor(
    id: string,
    config: Record<string, unknown> | undefined,
    eventTransceiver: TypedEventTransceiver,
  ) {
    // We use the simulator to emit/receive events.
    this.et = eventTransceiver;
    this.id = id;

    if (!config) throw new Error(`[${this.id}] No configuration provided`);
    this.config = verify(config, {
      lines: {
        type: "number",
        default: 15,
      },
    });

    console.log(`[${this.id}] Memory Initializing module.`);
  }

  /**
   * Wrapper around the event emitter to read bytes from memory (big-endian).
   */
  read = async (address: number, bytes = 1) => {
    let val = 0;

    for (let i = 0; i < bytes; i++) {
      // TODO: Maybe do some comparison that the read address is the correct one?
      const [_, data] = await this.et.emitAndWait(
        "ui:memory:read:result",
        "ui:memory:read",
        address + i,
      );
      if (data == null) throw new Error(`[${this.id}] read an undefined byte!1!!`);

      val = (val << 8) | data;
    }

    return val;
  };

  onGuiPanelCreated = (panel_id: string, panel: HTMLElement): void => {
    if (this.id !== panel_id) return;
    console.log(`[${this.id}] obtained GUI panel`);

    this.panel = panel;
    this.panel.classList.add("instruction-ui");
  };

  /**
   * A callback for when the registers are updated.
   * This only happens when an instruction has finished executing, so we can
   * interpret the current value as the start of the an instruction.
   */
  onRegistersUpdate = (registers: Registers): void => {
    if (!this.panel) return;

    const oldRegs = this.registers;
    this.registers = registers.copy();

    // If the PC hasn't changed, we don't need to update the panel.
    if (oldRegs !== undefined && oldRegs.pc === registers.pc) return;

    this.populatePanel();
  };

  onReset = (): void => {
    if (!this.panel) return;

    // Clear the panel.
    this.panel.innerHTML = "";

    // Clear the registers.
    this.registers = undefined;
    this.cache.clear();
  };

  formatAddress(data: number): string {
    return data.toString(16).padStart(4, "0");
  }

  cache: InstructionCache = new InstructionCache();

  // NOTE: This function requires the registers to be set.
  populateRow = async (row: HTMLDivElement, address: number, isPC: boolean): Promise<number> => {
    const children = Array.from(row.children) as HTMLSpanElement[];
    const cached = this.cache.get(address);
    if (cached) {
      const rowData = generateRowData(cached, this.formatAddress);
      row.classList.toggle("pc", isPC);
      generateInstructionElement(rowData, children[1], children[2], children[3]);
      return cached.bytes.length;
    } else {
      throw new Error(`[${this.id}] Cache unpopulated when populating panel.`);
    }
  };

  decompileFuture = async (start: number, num: number): Promise<void> => {
    let addr = start;
    for (let i = 0; i < num; i++) {
      // We decompile the future instructions and use them to populate the cache.
      // const cached = this.cache.get(addr);
      // if (cached) {
      //   addr += cached.bytes.length;
      //   continue;
      // }

      const decompiled = await decompileInstruction(this.read, this.registers!, addr);

      // If the instruction is valid, we add it to the cache, otherwise, the
      // cache will remove it.
      this.cache.update(decompiled);
      addr += decompiled.bytes.length;
    }
  };

  async populatePanel(): Promise<void> {
    if (!this.panel || !this.registers) return;

    // For each valid* PC that the CPU is on, we check:
    // - this.config.lines instructions in the future
    await this.decompileFuture(this.registers.pc, this.config.lines);
    // - this.config.lines instructions in the past
    // TODO
    // We are adding these to the cache.
    //
    // Then we are updating the panel with the cache.
    // The panel starts at the cache start address, and ends at the cache end
    // address.
    // TODO: There should be a button that locks/unlocks the scroll to the PC.

    this.panel.innerHTML = "";
    for (const addr of this.cache.sortedAddresses) {
      const rowElement = element(
        "div",
        { className: "row" },
        element("span", {
          className: "address",
          innerText: "....",
        }),
        element("span", { className: "raw", innerText: "..." }),
        element("span", { className: "data", innerText: "..." }),
        element("span", { className: "extra", innerText: "" }),
      );

      await this.populateRow(rowElement, addr, addr === this.registers.pc);
      this.panel.appendChild(rowElement);
    }
    // * Valid means that the PC is on an instruction boundary.
  }
}

export default InstructionUI;
