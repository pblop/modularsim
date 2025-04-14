import { verify } from "../../../utils/config.js";
import { element } from "../../../utils/html.js";
import { UpdateQueue } from "../../../utils/updatequeue.js";
import type { EventDeclaration, TypedEventTransceiver } from "../../../types/event.js";
import type { IModule, ModuleDeclaration } from "../../../types/module.js";
import type { Registers } from "../cpu/cpu_parts.js";
import {
  DecompiledInstruction,
  FailedDecompilation,
  decompileInstruction,
  generateInstructionElement,
  generateRowData,
} from "../cpu/decompile.js";
import { InstructionCache } from "../instruction_ui/instruction_ui/inst_cache.js";

type InstructionUIConfig = {
  maxRows: number;
};

class HistoryUI implements IModule {
  et: TypedEventTransceiver;
  id: string;

  config: InstructionUIConfig;

  registers?: Registers;

  panel?: HTMLElement;

  updateQueue: UpdateQueue<Registers | null>;
  cache: InstructionCache;

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
        optional: {
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
      maxRows: { type: "number", default: 20 },
    });

    this.updateQueue = new UpdateQueue(this.refreshUI.bind(this));
    this.cache = new InstructionCache((addr) =>
      decompileInstruction(this.read, this.registers!, addr),
    );

    console.log(`[${this.id}] Memory Initializing module.`);
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
      if (data == null) throw new Error(`[${this.id}] read an undefined byte!1!!`);

      val = (val << 8) | data;
    }

    return val;
  };

  onGuiPanelCreated = (panel_id: string, panel: HTMLElement): void => {
    if (this.id !== panel_id) return;
    console.log(`[${this.id}] obtained GUI panel`);

    this.panel = panel;
    this.panel.classList.add("history-ui");

    // this.anchor = element("div", { properties: { className: "scroll-anchor" } });
    // this.panel.appendChild(this.anchor);
  };

  onMemoryWrite = (address: number, data: number): void => {
    if (!this.panel) return;
    this.cache.invalidate(address);
  };

  onRegistersUpdate = (registers: Registers): void => {
    if (!this.panel) return;

    const oldRegs = this.registers;
    this.registers = registers.copy();

    // If the PC hasn't changed, we don't need to update the panel.
    if (oldRegs !== undefined && oldRegs.pc === registers.pc) return;

    this.updateQueue.queueUpdate(this.registers);
  };

  refreshUI = async (regsQueue: (Registers | null)[]) => {
    if (!this.panel) return;
    if (regsQueue.length === 0) return;

    for (const regs of regsQueue) {
      if (regs === null) {
        this.panel.innerHTML = "";
        this.registers = undefined;
      } else {
        await this.populatePanel(regs);
        this.removeTooOldRows();
      }
    }
  };

  onReset = (): void => {
    if (!this.panel) return;

    // Clear the panel.
    this.registers = undefined;
    this.updateQueue.queueUpdate(null);
    this.cache.clear();
  };

  formatAddress(data: number): string {
    return data.toString(16).padStart(4, "0");
  }

  removeTooOldRows() {
    if (!this.panel) return;

    const rows = this.panel.children;
    if (rows.length > this.config.maxRows) {
      for (let i = 0; i < rows.length - this.config.maxRows; i++) {
        this.panel.removeChild(rows[i]);
      }
    }
  }

  async populatePanel(regs: Registers): Promise<void> {
    if (!this.panel) return;

    const startAddress = regs.pc;
    let currentAddress = startAddress;

    const row = element(
      "div",
      { className: "row" },
      element("span", {
        className: "address",
        innerText: "0000",
      }),
      element("span", { className: "raw", innerText: "..." }),
      element("span", { className: "data", innerText: "..." }),
      element("span", { className: "extra", innerText: "" }),
    );

    const decompiled = await this.cache.getOrGenerate(currentAddress);
    const rowData = generateRowData(decompiled, this.formatAddress);
    generateInstructionElement(
      rowData,
      row.children[0] as HTMLSpanElement,
      row.children[1] as HTMLSpanElement,
      row.children[2] as HTMLSpanElement,
      row.children[3] as HTMLSpanElement,
    );

    currentAddress += decompiled.bytes.length;

    // Auto scroll to bottom if already on bottom. I haven't been able to achieve
    // this with CSS, so I'm doing it here.
    const atBottom = this.panel.scrollHeight - this.panel.clientHeight <= this.panel.scrollTop + 1;
    this.panel.appendChild(row);
    if (atBottom) this.panel.scrollTop = this.panel.scrollHeight - this.panel.clientHeight;
  }
}

export default HistoryUI;
