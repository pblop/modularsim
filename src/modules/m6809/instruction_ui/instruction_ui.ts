import { verify } from "../../../utils/config.js";
import { element, iconButton } from "../../../utils/html.js";
import { createLanguageStrings } from "../../../utils/lang.js";
import { UpdateQueue } from "../../../utils/updatequeue.js";
import type {
  EventContext,
  EventDeclaration,
  EventDeclarationListeners,
  TypedEventTransceiver,
} from "../../../types/event.js";
import type { IModule, ModuleDeclaration } from "../../../types/module.js";
import { Registers } from "../cpu/cpu_parts.js";
import {
  type AllInstructionRowData,
  type DecompiledInstruction,
  type FailedDecompilation,
  type InstructionRowData,
  disassembleInstruction,
  eqDecompilation,
  generateRowData,
  getSymbolicAddress,
} from "../cpu/decompile.js";
import { InstructionCache } from "./instruction_ui/inst_cache.js";
import { InstructionHistory } from "./instruction_ui/inst_history.js";
import { hex, hexSign } from "../../../utils/numbers.js";

type InstructionUIConfig = {
  /*
   * The address to start disassembling from, if any.
   * Will be ignored if autoPosition is set.
   */
  initialPosition?: number;
  /*
   * The CPU type to use for auto-positioning.
   * If set, the UI will find the starting address of the CPU and use that as
   * the starting address for disassembling instructions.
   */
  autoPosition: "m6809" | undefined;
  lines: number;
  /**
   * How to show the addresses in the instruction UI.
   * If set to "offset", the addresses will be shown as "symbol+offset".
   * If set to "single", there will be a new row for the symbols.
   * If set to "none" or not set, the addresses will be printed as hex
   * addresses.
   */
  symbols: "offset" | "single" | "none";
  maxSymbolLength: number;
  /**
   * The maximum offset to show in the instruction UI, if the offset from the
   * nearest symbol is larger than this value, no symbol will be shown.
   */
  maxSymbolOffset: number;
};

const InstructionUIStrings = createLanguageStrings({
  en: {
    clearAlt: "Clear the instruction cache",
    lockAlt: "Scroll with PC",
    overlappedInfo: "This instruction is overlapped by another instruction.",
    overwrittenInfo: "This instruction was overwritten.",
    backwardsDisassemblyInfo: "This instruction was disassembled backwards, it might be incorrect.",
  },
  es: {
    clearAlt: "Limpiar la caché de instrucciones",
    lockAlt: "Desplazarse con el PC",
    overlappedInfo: "Esta instrucción está superpuesta por otra instrucción.",
    overwrittenInfo: "Esta instrucción fue sobrescrita.",
    backwardsDisassemblyInfo:
      "Esta instrucción ha sido desensamblada hacia atrás, puede ser incorrecta.",
  },
});

class InstructionUI implements IModule {
  et: TypedEventTransceiver;
  id: string;

  config: InstructionUIConfig;

  registers?: Registers;
  // The initial registers store the first set of registers that the CPU gives
  // us after the first reset. This way, we can show the initial state of the
  // CPU after the second reset.
  initialRegisters?: Registers;
  // The initial address is:
  // - if autoPosition is set, at first, the address that the CPU will start
  //   executing instructions from.
  // - after the first reset, the value of the PC register.
  initialAddress?: number;

  panel?: HTMLElement;
  instructionsElement?: HTMLElement;

  language!: string;
  localeStrings!: typeof InstructionUIStrings.en;

  // An internal timer to keep track of when the instructions stored in the
  // cache/history were stored.
  modificationNumber: number;

  updateQueue: UpdateQueue<Registers>;
  cache: InstructionCache;
  lockPC: boolean;
  symbols: [string, number][] = [];
  symbolsMap: Map<number, string> = new Map();

  getModuleDeclaration(): ModuleDeclaration {
    let optionalEvents: EventDeclarationListeners = {
      "ui:breakpoint:add": this.onBreakpointAdd,
      "ui:breakpoint:remove": this.onBreakpointRemove,
      "memory:write": this.onMemoryWrite,
      "ui:memory:write": this.onMemoryWrite,
      "dbg:symbol:add": this.onAddSymbol,
      "dbg:symbol:clear": this.onClearSymbols,
    };

    // If the autoPosition is set to m6809, we will also listen for the
    // ui:memory:bulk:write:result event to see the vector table being written.
    if (this.config.autoPosition === "m6809") {
      optionalEvents = {
        ...optionalEvents,
        "ui:memory:bulk:write:result": this.onMemoryBulkWriteResult,
      };
    }

    return {
      events: {
        provided: ["ui:memory:read", "ui:breakpoint:add", "ui:breakpoint:remove"],
        required: {
          "ui:memory:read:result": null,
          "gui:panel_created": this.onGuiPanelCreated,
          "cpu:registers_update": this.onRegistersUpdate,
          "signal:reset": this.onReset,
          "ui:memory:clear": this.onMemoryClear,
        },
        optional: optionalEvents,
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
      symbols: {
        type: "string",
        required: false,
        default: "none",
        enum: ["offset", "single", "none"],
      },
      maxSymbolLength: {
        type: "number",
        default: 10,
      },
      initialPosition: {
        type: "number",
        required: false,
        default: undefined,
      },
      autoPosition: {
        type: "string",
        required: false,
        default: undefined,
        enum: ["m6809"],
      },
      maxSymbolOffset: {
        type: "number",
        required: false,
        default: 10000,
      },
    });

    this.modificationNumber = 0;
    this.history = new InstructionHistory();

    this.updateQueue = new UpdateQueue(this.refreshUI.bind(this));
    this.cache = new InstructionCache((addr) => disassembleInstruction(this.read, addr));
    this.lockPC = true;

    if (this.config.initialPosition !== undefined) {
      this.initialAddress = this.config.initialPosition;
      this.setInitialPosition();
    }

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
    this.updateQueue.queueUpdate(this.registers);
  };

  onGuiPanelCreated = (panel_id: string, panel: HTMLElement, language: string): void => {
    if (this.id !== panel_id) return;
    console.log(`[${this.id}] obtained GUI panel`);

    this.panel = panel;
    this.panel.classList.add("instruction-ui");

    const addressSize =
      this.config.symbols === "offset"
        ? this.config.maxSymbolLength + 5 // symbol + "+" + hex addresses
        : 4; // 4 hex digits
    this.panel.style.setProperty("--instruction-ui-address-size", `${addressSize}ch`);
    this.panel.style.setProperty(
      "--instruction-ui-symbol-size",
      `${this.config.maxSymbolLength}ch`,
    );

    this.setLanguage(language);

    const clearbutton = iconButton("clear-icon", this.localeStrings.clearAlt, async () => {
      this.history.clear();
      this.cache.clear();
      this.modificationNumber = 0;
      this.updateQueue.queueUpdate(this.registers);
    });
    const lockbutton = iconButton("lock-icon", this.localeStrings.lockAlt, (icon) => {
      icon.classList.toggle("unlock-icon");
      icon.classList.toggle("lock-icon");
      this.lockPC = !this.lockPC;
    });

    this.panel.appendChild(element("div", { className: "buttons" }, clearbutton, lockbutton));
    this.instructionsElement = element("div", { className: "instruction-container" });
    this.panel.appendChild(this.instructionsElement);
  };

  onMemoryBulkWriteResult = (dataStart: number, data: Uint8Array): void => {
    if (this.config.autoPosition === "m6809" && this.registers === undefined) {
      // If the data contains the reset vector, we move the instruction UI
      // to that address.

      if (dataStart <= 0xfffe && dataStart + data.length >= 0xffff) {
        const iFFFE = 0xfffe - dataStart;
        const iFFFF = 0xffff - dataStart;
        const resetVector = (data[iFFFE] << 8) | data[iFFFF];

        this.initialAddress = resetVector;
        this.setInitialPosition();
      }
    }
  };

  onMemoryClear = (): void => {
    this.history.clear();
    this.cache.clear();
    this.modificationNumber = 0;
    this.instructionsElement!.innerHTML = "";
    this.initialRegisters = undefined;
    this.initialAddress = undefined;
    this.registers = undefined;
  };

  setInitialPosition = (): void => {
    if (!this.initialRegisters) {
      if (this.initialAddress !== undefined) {
        // NOTE: This is a bit hacky, but I am assuming that all the registers'
        // initial values are 0 (for the purpose of providing extra disassembly
        // context).
        this.registers = new Registers(0, 0, 0, 0, 0, 0, 0, this.initialAddress);
        this.updateQueue.queueUpdate(this.registers);
      }
      // If the initial address is not set, we don't have any way to know the
      // initial position of the CPU, so we don't do anything.
    } else {
      // NOTE: This is also a bit hacky, because we assume that the initial
      // registers after the first reset are the same as the initial
      // registers after the second reset. This might not be true. In the case
      // of the M6809, if the reset vector is modified during execution. This
      // will not hold.
      this.registers = this.initialRegisters.copy();
      this.updateQueue.queueUpdate(this.registers);
    }
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

    // When the registers are updated for the first time, we set the initial
    // registers and address, so that, when the user resets the CPU, we can
    // show the initial state that it will reset to.
    if (oldRegs === undefined) {
      this.initialRegisters = registers;
      this.initialAddress = registers.pc;
    }

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

    this.setInitialPosition();
  };

  onAddSymbol = (symbol: string, address: number): void => {
    if (!this.instructionsElement) return;

    this.symbols.push([symbol, address]);
    this.symbolsMap.set(address, symbol);
    this.updateQueue.queueUpdate();
  };
  onClearSymbols = (): void => {
    if (!this.instructionsElement) return;

    this.symbols = [];
    this.symbolsMap.clear();
    this.updateQueue.queueUpdate();
  };

  /**
   * Formats an address for display in the instruction UI, based on the type of
   * column and the current configuration.
   * If the symbols are enabled (offset, extra) and found:
   * - If writing an address to the data field, it will return the symbol and
   *   offset if the config is set to "offset".
   * - If writing an address to the extra field, it will return the symbol
   *   and offset if the config is set to either "offset" or "extra".
   * Otherwise, it will return the address as a hexadecimal string.
   */
  formatAddress = (data: number, column: "address" | "extra"): string => {
    // If we have symbols, we will use them to display the address.
    // Otherwise, we will use the address.
    if (this.config.symbols && this.symbols.length > 0) {
      const [symbol, offset] = getSymbolicAddress(this.symbols, data, this.config.maxSymbolOffset);
      if (symbol && (this.config.symbols === "offset" || column === "extra")) {
        const truncatedSymbol = symbol.slice(0, this.config.maxSymbolLength);

        if (offset === 0) return truncatedSymbol;
        else return `${truncatedSymbol}${hexSign(offset, 1)}`;
      }
    }
    return hex(data, 2);
  };
  /**
   * Formats an offset for display in the instruction UI.
   * If the symbols are enabled and found for the given address,
   * it will return the symbol and offset.
   */
  formatOffset = (offset: number, address: number, type: "relative" | "indexed"): string => {
    // If we have symbols, we will use them to display the offset.
    // Otherwise, we will use the offset as a hexadecimal string.
    if (this.config.symbols && this.symbols.length > 0) {
      const [symbol, offset] = getSymbolicAddress(
        this.symbols,
        address,
        this.config.maxSymbolOffset,
      );
      if (symbol && this.config.symbols !== "none") {
        const truncatedSymbol = symbol.slice(0, this.config.maxSymbolLength);

        if (offset === 0) return truncatedSymbol;
        else return `${truncatedSymbol}${hexSign(offset, 1)}`;
      }
    }
    if (type === "relative")
      // Relative offsets are shown as PC+offset.
      return `PC${hexSign(offset, 0)}`;
    else return hexSign(offset, 0);
  };

  generateTitle = (data: number): string | undefined => {
    // If we have symbols, the title will be the normal address.
    // Otherwise, no title will be shown.

    if (this.config.symbols === "offset" && this.symbols.length > 0) {
      const [symbol, offset] = getSymbolicAddress(this.symbols, data, this.config.maxSymbolOffset);
      if (symbol) return `${hex(data, 2)}`;
    }

    return undefined;
  };

  history: InstructionHistory = new InstructionHistory();
  breakpoints: number[] = [];

  // NOTE: This function requires the registers to be set.
  populateRow = async (
    row: HTMLDivElement,
    disass: DecompiledInstruction | FailedDecompilation,
    extras: {
      isPC?: boolean;
      isOverlapped?: boolean;
      isOverwritten?: boolean;
      isBackwardsDisass?: boolean;
    } = {},
  ): Promise<number> => {
    const children = Array.from(row.children) as HTMLSpanElement[];

    const address = disass.startAddress;
    row.setAttribute("data-address", address.toString());
    row.classList.toggle("pc", !!extras.isPC);
    row.classList.toggle("overlap", !!extras.isOverlapped);
    row.classList.toggle("overwritten", !!extras.isOverwritten);
    if (extras.isOverlapped) row.setAttribute("title", this.localeStrings.overlappedInfo);
    else if (extras.isOverwritten) row.setAttribute("title", this.localeStrings.overwrittenInfo);
    if (extras.isBackwardsDisass) {
      row.classList.add("backwards-disass");
      row.title = this.localeStrings.backwardsDisassemblyInfo;
    }

    const rowData = generateRowData(
      disass,
      this.formatAddress,
      this.formatOffset,
      this.generateTitle,
    );

    // Get the parts of the row.
    const addressElement = children.find((el) => el.classList.contains("address"))!;
    const rawElement = children.find((el) => el.classList.contains("raw"))!;
    const symbolElement = children.find((el) => el.classList.contains("symbol"));
    const dataChildren = Array.from(
      children.find((el) => el.classList.contains("data"))!.children,
    ) as HTMLSpanElement[];
    const mnemonicElement = dataChildren.find((el) => el.classList.contains("mnemonic"))!;
    const argsElement = dataChildren.find((el) => el.classList.contains("args"))!;
    const extraElement = children.find((el) => el.classList.contains("extra"))!;

    // Fill the parts with data.
    addressElement.innerText = rowData.address;
    rawElement.innerText = rowData.raw;
    mnemonicElement.innerText = rowData.ok ? rowData.mnemonic : "???";
    argsElement.innerText = rowData.ok ? rowData.args : "???";
    extraElement.innerText = rowData.ok ? rowData.extra : "???";
    if (rowData.ok && row.title) addressElement.title = row.title;
    if (this.config.symbols === "single" && this.symbolsMap.has(address)) {
      // If the symbol is too long, we truncate it.
      const symbol = this.symbolsMap.get(address);
      if (symbol) {
        symbolElement!.innerText = symbol.slice(0, this.config.maxSymbolLength);
      }
    }

    // Mark the address as a breakpoint if it is in the breakpoints list.
    if (this.breakpoints.includes(address)) {
      row.classList.add("breakpoint");
      row.classList.add("contrast-color");
    }

    return disass.bytes.length;
  };

  #disassemblePast = async (start: number, num: number, stop = 0): Promise<HTMLElement[]> => {
    if (!this.instructionsElement || !this.registers) return [];
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
        if (newAddr < stop) break;
        const decompiled = await this.cache.getOrGenerate(newAddr);
        if (decompiled.failed || decompiled.bytes.length !== size) continue;

        largestSuccess = decompiled;
      }

      // If we have not succeeded, we stop.
      if (largestSuccess == null) break;

      // If the instruction goes past the stop address, we stop.
      if (largestSuccess.startAddress < stop) break;

      // If we have succeeded, we add the instruction to the panel.
      const rowElement = this.#createBasicRowElement();
      await this.populateRow(rowElement, largestSuccess, {
        isPC: largestSuccess.startAddress === this.registers.pc,
        isBackwardsDisass: true,
      });
      elements.push(rowElement);

      addr -= largestSuccess.bytes.length;
    }

    // Add the elements in reverse order.
    for (let i = elements.length - 1; i >= 0; i--) {
      this.instructionsElement.appendChild(elements[i]);
    }

    return elements;
  };

  #disassembleFuture = async (
    start: number,
    stop: { address?: number; number?: number },
  ): Promise<[HTMLElement[], number]> => {
    if (!this.instructionsElement || !this.registers) return [[], -1];

    const elements: HTMLElement[] = [];
    let lastAddress = -1;
    let addr = start;
    for (
      let i = 0;
      (!stop.number || i < stop.number) && (!stop.address || addr < stop.address);
      i++
    ) {
      const disass = await this.cache.getOrGenerate(addr);

      // If the instruction takes more bytes than we have left, we stop.
      if (stop.address && addr + disass.bytes.length > stop.address) break;

      if (disass.failed) break;

      const rowElement = this.#createBasicRowElement();
      await this.populateRow(rowElement, disass, {
        isPC: disass.startAddress === this.registers.pc,
      });
      this.instructionsElement.appendChild(rowElement);
      elements.push(rowElement);

      lastAddress = disass.startAddress + disass.bytes.length;

      addr += disass.bytes.length;
    }

    return [elements, lastAddress];
  };

  #createBasicRowElement = (): HTMLDivElement => {
    const rowElement = element(
      "div",
      {
        className: "row",
        onClick: (el) => {
          const addressStr = el.getAttribute("data-address");
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
      },
      element("span", {
        className: "address",
        innerText: "0000",
      }),
      this.config.symbols === "single"
        ? element("span", {
            className: "symbol",
            innerText: "",
          })
        : undefined,
      element("span", { className: "raw", innerText: "..." }),
      element(
        "span",
        { className: "data", innerText: "" },
        element("span", {
          className: "mnemonic",
          innerText: "...",
        }),
        element("span", {
          className: "args",
          innerText: "",
        }),
      ),
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

    // TODO: Make it so disassembling in the future stops on the first failed
    // disassembly(done), and then, disassemblePast in the next group correctly
    // disassembles until the last successful disassembly.
    const groups = this.history.getAllConsecutiveEntryGroups(true);
    let lastAddress = 0;
    for (let i = 0; i < groups.length; i++) {
      let firstElement: HTMLElement | undefined;
      let lastElement: HTMLElement | undefined;
      // TODO: Disassemble instructions backwards from the current group on
      // _all_ groups, not just the first one, and stop when we reach
      // this.config.lines / 2 or an instruction we've already disassembled.
      // We disassemble instructions from the current group start backwards (
      // overwriting if already disassembled), and then we populate the panel.
      if (i === 0) {
        const elements = await this.#disassemblePast(
          groups[i].entries[0].address,
          this.config.lines / 2,
          lastAddress,
        );
        firstElement = elements[0];
        lastElement = elements[elements.length - 1];
      }

      const group = groups[i];
      const { entries, end } = group;
      for (const entry of entries) {
        const rowElement = this.#createBasicRowElement();
        await this.populateRow(rowElement, entry.disass, {
          isPC: entry.address === this.registers.pc,
          isOverlapped: this.history.isOverlapped(entry),
          isOverwritten: this.history.isOverwritten(entry),
        });
        this.instructionsElement.appendChild(rowElement);

        if (this.lockPC && entry.address === this.registers.pc) {
          // scrollIntoView moves the whole viewport, so we will change the
          // panel's scrollTop to match the row's position.
          this.instructionsElement!.scrollTop = rowElement.offsetTop;
          // rowElement.scrollIntoView({ block: "nearest", inline: "nearest" });
        }
        if (firstElement === undefined) firstElement = rowElement;
        lastElement = rowElement;
        lastAddress = entry.disass.startAddress + entry.disass.bytes.length;
      }

      // We disassemble instructions from the current group start forwards (
      // overwriting if already disassembled), at a maximum of this.config.lines
      // instructions or until we reach the start address of the next group (if
      // there's a next group).
      const nextGroupStart = groups[i + 1]?.entries[0].address;
      const [futures, lastFutureAddr] = await this.#disassembleFuture(end, {
        number: this.config.lines,
        address: nextGroupStart,
      });
      if (futures.length > 0) {
        lastElement = futures[futures.length - 1];
        lastAddress = lastFutureAddr;
      }

      if (firstElement) firstElement.classList.add("first-in-group");
      if (lastElement) lastElement.classList.add("last-in-group");
    }
  }

  onBreakpointAdd = (address: number, ctx: EventContext): void => {
    if (ctx.emitter === this.id) return;

    const rowElement = this.instructionsElement?.querySelector(`.row[data-address="${address}"]`);
    if (rowElement) {
      rowElement.classList.add("breakpoint");
      rowElement.classList.add("contrast-color");
    }

    this.breakpoints.push(address);
  };

  onBreakpointRemove = (address: number, ctx: EventContext): void => {
    if (ctx.emitter === this.id) return;

    const rowElement = this.instructionsElement?.querySelector(`.row[data-address="${address}"]`);
    if (rowElement) {
      rowElement.classList.remove("breakpoint");
      rowElement.classList.remove("contrast-color");
    }

    this.breakpoints = this.breakpoints.filter((a) => a !== address);
  };
}

export default InstructionUI;
