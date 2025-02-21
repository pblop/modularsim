import type { IModule, ModuleDeclaration } from "../../types/module.js";
import type { EventDeclaration, TypedEventTransceiver } from "../../types/event.js";
import type { Registers } from "../util/cpu_parts.js";
import { element } from "../../general/html.js";
import {
  decompileInstruction,
  generateInstructionElement,
  generateRowData,
  type InstructionRowData,
} from "../util/decompile.js";
import { verify } from "../../general/config.js";

type InstructionUIConfig = {
  lines: number;
};

class InstructionCache {
  cache: Record<number, InstructionRowData> = {};

  add(address: number, data: InstructionRowData): void {
    // Remove the instruction that contains the address, if it exists.
    const containing = this.getInstructionContaining(address);
    if (containing !== undefined) delete this.cache[containing];

    // Remove the instructions that will be contained by the new instruction.
    const future = this.getFutureContaining(address, data.size);
    for (const addr of future) {
      delete this.cache[addr];
    }

    this.cache[address] = data;
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
      if (this.cache[address - i]) return address - i;
    }
    return undefined;
  }

  /**
   * Returns the address of the instructions that will be contained by an
   * instruction inserted at the given address with the given size.
   * @param address The address to insert the instruction at.
   * @param size The size of the instruction to insert.
   * @returns The addresses of the instructions that will be contained by the
   * instruction inserted at the given address.
   */
  getFutureContaining(address: number, size: number): number[] {
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
  get(address: number): InstructionRowData | undefined {
    // Check if the address is already in the cache.
    if (this.cache[address]) return this.cache[address];

    // The address is not in the cache, now we need to check if the cache is
    // correct.
    // If the previous instruction that's in the cache contains the current
    // address, we probably need to invalidate that.
    const prevAddr = this.getInstructionContaining(address);
    if (prevAddr !== undefined) {
      delete this.cache[prevAddr];
    }

    return undefined;
  }

  clear(): void {
    this.cache = {};
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

    for (let i = 0; i < this.config.lines; i++) {
      this.panel.appendChild(
        element(
          "div",
          { className: "row" },
          element("span", {
            className: "address",
            innerText: "....",
          }),
          element("span", { className: "raw", innerText: "..." }),
          element("span", { className: "data", innerText: "..." }),
          element("span", { className: "extra", innerText: "" }),
        ),
      );
    }
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
    for (let i = 0; i < this.config.lines; i++) {
      const children = Array.from(this.panel.children[i].children) as HTMLElement[];
      children[1].innerText = "";
      children[2].innerText = "";
      children[3].innerText = "";
    }

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
    const decompiled = await decompileInstruction(this.read, this.registers!, address);
    children[0].innerText = this.formatAddress(address);

    row.classList.toggle("pc", isPC);
    const rowData = generateRowData(decompiled, this.formatAddress);
    if (rowData.ok) this.cache.add(address, rowData);
    generateInstructionElement(rowData, children[1], children[2], children[3]);
    return decompiled.bytes.length;
  };

  async populatePanel(): Promise<void> {
    if (!this.panel || !this.registers) return;

    const startAddress = this.registers.pc;
    let currentAddress = startAddress;
    for (let i = 0; i < this.config.lines; i++) {
      currentAddress += await this.populateRow(
        this.panel.children[i] as HTMLDivElement,
        currentAddress,
        i === 0,
      );
    }
  }
}

export default InstructionUI;
