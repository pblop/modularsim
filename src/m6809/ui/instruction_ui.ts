import type { IModule, ModuleDeclaration } from "../../types/module.js";
import type { EventContext, EventDeclaration, TypedEventTransceiver } from "../../types/event.js";
import type { Registers } from "../util/cpu_parts.js";
import { element, iconButton } from "../../general/html.js";
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
import { InstructionHistory } from "./instruction_ui/inst_history.js";
import { createLanguageStrings } from "../../general/lang.js";
import { UpdateQueue } from "../../general/updatequeue.js";
import { InstructionCache } from "./instruction_ui/inst_cache.js";

type InstructionUIConfig = {
  lines: number;
};

const InstructionUIStrings = createLanguageStrings({
  en: {
    clearAlt: "Clear the instruction cache",
    lockAlt: "Scroll with PC",
    overlappedInfo: "This instruction is overlapped by another instruction.",
    overwrittenInfo: "This instruction was overwritten.",
  },
  es: {
    clearAlt: "Limpiar la caché de instrucciones",
    lockAlt: "Desplazarse con el PC",
    overlappedInfo: "Esta instrucción está superpuesta por otra instrucción.",
    overwrittenInfo: "Esta instrucción fue sobrescrita.",
  },
});

class InstructionUI implements IModule {
  et: TypedEventTransceiver;
  id: string;

  config: InstructionUIConfig;

  registers?: Registers;

  panel?: HTMLElement;
  instructionsElement?: HTMLElement;

  language!: string;
  localeStrings!: typeof InstructionUIStrings.en;

  // An internal timer to keep track of when the instructions stored in the
  // cache/history were stored.
  modificationNumber: number;

  updateQueue: UpdateQueue<Registers>;
  cache: InstructionCache;

  getModuleDeclaration(): ModuleDeclaration {
    return {
      events: {
        provided: ["ui:memory:read", "ui:breakpoint:add", "ui:breakpoint:remove"],
        required: {
          "ui:memory:read:result": null,
          "gui:panel_created": this.onGuiPanelCreated,
          "cpu:registers_update": this.onRegistersUpdate,
          "signal:reset": this.onReset,
        },
        optional: {
          "ui:breakpoint:add": this.onBreakpointAdd,
          "ui:breakpoint:remove": this.onBreakpointRemove,
          "memory:write": this.onMemoryWrite,
          "ui:memory:write": this.onMemoryWrite,
        },
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

    this.modificationNumber = 0;
    this.history = new InstructionHistory();

    this.updateQueue = new UpdateQueue(this.refreshUI.bind(this));
    this.cache = new InstructionCache((addr) =>
      decompileInstruction(this.read, this.registers!, addr),
    );

    console.log(`[${this.id}] Memory Initializing module.`);
  }

  setLanguage(language: string): void {
    this.language = language;
    this.localeStrings = InstructionUIStrings[this.language] || InstructionUIStrings.en;
  }

  /**
   * Wrapper around the event emitter to read bytes from memory (big-endian).
   */
  read = async (address: number, bytes = 1) => {
    let val = 0;

    for (let i = 0; i < bytes; i++) {
      const [addr, data] = await this.et.emitAndWait(
        "ui:memory:read:result",
        (args) => args[0] === address + i,
        "ui:memory:read",
        address + i,
      );
      if (addr !== address + i) throw new Error(`[${this.id}] read an unexpected byte!`);
      if (data == null) throw new Error(`[${this.id}] read an undefined byte!1!!`);

      val = (val << 8) | data;
    }

    return val;
  };

  onMemoryWrite = (address: number, data: number): void => {
    this.cache.invalidate(address);
    this.history.markOverwritten(address);
  };

  onGuiPanelCreated = (panel_id: string, panel: HTMLElement, language: string): void => {
    if (this.id !== panel_id) return;
    console.log(`[${this.id}] obtained GUI panel`);

    this.panel = panel;
    this.panel.classList.add("instruction-ui");

    this.setLanguage(language);

    const clearbutton = iconButton("clear-icon", this.localeStrings.clearAlt, async () => {
      this.history.clear();
      this.cache.clear();
      this.modificationNumber = 0;
      this.updateQueue.queueUpdate(this.registers);
    });
    const lockbutton = iconButton("unlock-icon", this.localeStrings.lockAlt, (icon) => {
      icon.classList.toggle("unlock-icon");
      icon.classList.toggle("lock-icon");
    });

    this.panel.appendChild(element("div", { className: "buttons" }, clearbutton, lockbutton));
    this.instructionsElement = element("div", { className: "instruction-container" });
    this.panel.appendChild(this.instructionsElement);
  };

  addNewPcToPanel = async (registers: Registers, pc: number): Promise<void> => {
    if (!this.registers) return;

    this.modificationNumber++;

    // We decompile the instruction at the current PC and store it in the history.
    const disass = await this.cache.getOrGenerate(pc);
    this.history.add({
      address: pc,
      time: this.modificationNumber,
      disass,
    });
  };

  /**
   * A callback for when the registers are updated.
   * This only happens when an instruction has finished executing, so we can
   * interpret the current value as the start of the an instruction.
   */
  onRegistersUpdate = async (registers: Registers): Promise<void> => {
    if (!this.panel) return;

    const oldRegs = this.registers;
    this.registers = registers.copy();

    // If the PC hasn't changed, we don't need to update the panel.
    if (oldRegs !== undefined && oldRegs.pc === this.registers.pc) return;

    this.updateQueue.queueUpdate(this.registers);
  };

  onReset = (): void => {
    // Clear the panel.
    if (this.instructionsElement) this.instructionsElement.innerHTML = "";

    // Clear the registers.
    this.registers = undefined;

    // Clear the caches.
    this.history.clear();
    this.cache.clear();
    this.modificationNumber = 0;
  };

  formatAddress(data: number): string {
    return data.toString(16).padStart(4, "0");
  }

  history: InstructionHistory = new InstructionHistory();
  breakpoints: number[] = [];

  // NOTE: This function requires the registers to be set.
  populateRow = async (
    row: HTMLDivElement,
    disass: DecompiledInstruction | FailedDecompilation,
    isPC: boolean,
    isOverlapped = false,
    isOverwritten = false,
  ): Promise<number> => {
    const children = Array.from(row.children) as HTMLSpanElement[];

    const address = disass.startAddress;

    row.classList.toggle("pc", isPC);
    row.classList.toggle("overlap", isOverlapped);
    row.classList.toggle("overwritten", isOverwritten);
    if (isOverlapped) row.setAttribute("title", this.localeStrings.overlappedInfo);
    else if (isOverwritten) row.setAttribute("title", this.localeStrings.overwrittenInfo);

    const rowData = generateRowData(disass, this.formatAddress);
    generateInstructionElement(rowData, children[0], children[1], children[2], children[3]);
    row.setAttribute("data-address", address.toString());
    if (this.breakpoints.includes(address)) {
      children[0].classList.add("breakpoint");
      children[0].classList.add("contrast-color");
    }

    return disass.bytes.length;
  };

  #disassemblePast = async (start: number, num: number): Promise<void> => {
    if (!this.instructionsElement || !this.registers) return;
    // To disassemble in the past, we will start from the given address
    // and go backwards. We will be greedy, meaning
    // that we will prefer a larger instruction over a smaller one.
    // e.g. If our memory is: $86 $4f (lda $4f), and we are at $4f, even though
    // $4f is a valid instruction (clra), we will prefer to decompile $86 $4f
    // as lda $4f.

    // Because we're disassembling backwards, we need to add the first decompiled
    // instruction last, so we will store them in an array and add them in reverse
    // order.
    const elements = [];

    let addr = start;
    for (let i = 0; i < num; i++) {
      let largestSuccess: DecompiledInstruction | null = null;
      for (let size = 1; size <= 5; size++) {
        const newAddr = addr - size;
        const decompiled = await this.cache.getOrGenerate(newAddr);
        if (decompiled.failed || decompiled.bytes.length !== size) continue;

        largestSuccess = decompiled;
      }

      // If we have not succeeded, we stop.
      if (largestSuccess == null) break;

      // If we have succeeded, we add the instruction to the panel.
      const rowElement = this.#createBasicRowElement();
      await this.populateRow(
        rowElement,
        largestSuccess,
        largestSuccess.startAddress === this.registers.pc,
      );
      elements.push(rowElement);

      addr -= largestSuccess.bytes.length;
    }

    // Add the elements in reverse order.
    for (let i = elements.length - 1; i >= 0; i--) {
      this.instructionsElement.appendChild(elements[i]);
    }
  };

  #disassembleFuture = async (
    start: number,
    stop: { address: number } | { number: number },
  ): Promise<void> => {
    if (!this.instructionsElement || !this.registers) return;

    let addr = start;
    for (let i = 0; "number" in stop ? i < stop.number : addr < stop.address; i++) {
      const disass = await this.cache.getOrGenerate(addr);

      // TODO: Maybe add an optional parameter to the decompileInstruction function
      // that allows us to stop at a certain address (and that fails if it's too
      // short).

      // If the instruction takes more bytes than we have left, we stop.
      if ("address" in stop && addr + disass.bytes.length > stop.address) break;

      const rowElement = this.#createBasicRowElement();
      await this.populateRow(rowElement, disass, disass.startAddress === this.registers.pc);
      this.instructionsElement.appendChild(rowElement);

      addr += disass.bytes.length;
    }
  };

  #createBasicRowElement = (): HTMLDivElement => {
    const rowElement = element(
      "div",
      { className: "row" },
      element("span", {
        className: "address",
        innerText: "0000",
        onClick: (el) => {
          const addressStr = rowElement.getAttribute("data-address");
          if (!addressStr) return;
          const address = Number.parseInt(addressStr);

          if (el.classList.contains("breakpoint")) {
            this.et.emit("ui:breakpoint:remove", address);
            this.breakpoints = this.breakpoints.filter((a) => a !== address);
          } else {
            this.et.emit("ui:breakpoint:add", address);
            this.breakpoints.push(address);
          }

          el.classList.toggle("breakpoint");
          el.classList.toggle("contrast-color");
        },
      }),
      element("span", { className: "raw", innerText: "..." }),
      element("span", { className: "data", innerText: "..." }),
      element("span", { className: "extra", innerText: "" }),
    );
    return rowElement;
  };

  async refreshUI(regsQueue?: Registers[]): Promise<void> {
    if (regsQueue !== undefined) {
      // We need to add the new PCs to the panel.
      for (const regs of regsQueue) {
        await this.addNewPcToPanel(regs, regs.pc);
      }
    }
    await this.populatePanel();
  }

  async populatePanel(): Promise<void> {
    if (!this.instructionsElement || !this.registers) return;
    this.instructionsElement.innerHTML = "";

    // * Valid means that the PC is on an instruction boundary.
    // For each valid* PC that the CPU is on, we check:
    // - this.config.lines instructions in the future
    // await this.decompileFuture(this.registers.pc, this.config.lines);
    // // - this.config.lines/2 instructions in the past
    // await this.decompilePast(this.registers.pc, this.config.lines / 2);
    // We are adding these to the cache.
    //
    // Then we are updating the panel with the cache.
    // The panel starts at the cache start address, and ends at the cache end
    // address.

    // TODO: Make sure that, when speculatively disassembling, we don't disassemble
    // the same memory address twice!
    // TODO: Make it so disassembling in the future stops on the first failed
    // disassembly, and then, disassemblePast in the next group correctly
    // disassembles until the last successful disassembly.
    const groups = this.history.getAllConsecutiveEntryGroups(true);
    for (let i = 0; i < groups.length; i++) {
      // We disassemble instructions from the current group start backwards (
      // overwriting if already disassembled), and then we populate the panel.
      if (i === 0) await this.#disassemblePast(groups[i].entries[0].address, this.config.lines / 2);

      const group = groups[i];
      const { entries, end } = group;
      for (const entry of entries) {
        const rowElement = this.#createBasicRowElement();
        await this.populateRow(
          rowElement,
          entry.disass,
          entry.address === this.registers.pc,
          this.history.isOverlapped(entry),
          this.history.isOverwritten(entry),
        );
        this.instructionsElement.appendChild(rowElement);
      }

      // We disassemble instructions from the current group start forwards (
      // overwriting if already disassembled), and then we populate the panel,
      // stopping at the end of the group, or at a maximum of this.config.lines
      // instructions.
      const nextGroup = groups[i + 1];
      if (nextGroup) this.#disassembleFuture(end, { address: nextGroup.entries[0].address });
      else this.#disassembleFuture(end, { number: this.config.lines });
    }
  }

  onBreakpointAdd = (address: number, ctx: EventContext): void => {
    if (ctx.emitter === this.id) return;

    const addressElement = this.instructionsElement?.querySelector(
      `.row[data-address="${address}"] > .address`,
    );
    if (addressElement) {
      addressElement.classList.add("breakpoint");
      addressElement.classList.add("contrast-color");
    }

    this.breakpoints.push(address);
  };

  onBreakpointRemove = (address: number, ctx: EventContext): void => {
    if (ctx.emitter === this.id) return;

    const addressElement = this.instructionsElement?.querySelector(
      `.row[data-address="${address}"] > .address`,
    );
    if (addressElement) {
      addressElement.classList.remove("breakpoint");
      addressElement.classList.remove("contrast-color");
    }

    this.breakpoints = this.breakpoints.filter((a) => a !== address);
  };
}

export default InstructionUI;
