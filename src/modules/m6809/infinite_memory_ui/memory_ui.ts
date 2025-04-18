import { element, rewrittableTableElement } from "../../../utils/html.js";
import { createLanguageStrings } from "../../../utils/lang.js";
import { UpdateQueue } from "../../../utils/updatequeue.js";
import type { EventDeclaration, TypedEventTransceiver } from "../../../types/event.js";
import type { IModule, ModuleDeclaration } from "../../../types/module.js";
import type { ISimulator } from "../../../types/simulator.js";
import { verify } from "../../../utils/config.js";
import { VirtualListElement } from "../../../utils/VirtualListElement.js";

type MemoryUIConfig = {
  start: number;
  size: number;
};

const MemoryUIStrings = createLanguageStrings({
  en: {
    address: "Memory address",
    value: "Value",
    write: "Write",
    read: "Read",
    onlyHex: "Only 1-byte hex values are allowed.",
  },
  es: {
    address: "Dirección de memoria",
    value: "Valor",
    write: "Escribir",
    read: "Leer",
    onlyHex: "Sólo se permiten valores hexadecimales de 1 byte",
  },
});

type UpdateQueueElement =
  | { address: number | undefined; type: "read" | "pc" | "write" }
  | { address: number; type: "write_result"; data: number }
  | { address: number; type: "bulk_write"; data: Uint8Array };

class MemoryUI implements IModule {
  event_transceiver: TypedEventTransceiver;
  id: string;

  config: MemoryUIConfig;

  panel?: HTMLElement;
  memoryTable?: VirtualListElement;

  memory: Uint8Array = new Uint8Array(0x10000);

  lastMemoryRead?: number;
  lastMemoryWrite?: number;
  pc?: number;

  language!: string;
  localeStrings!: typeof MemoryUIStrings.en;

  updateQueue: UpdateQueue;

  getModuleDeclaration(): ModuleDeclaration {
    return {
      events: {
        provided: ["ui:memory:read", "ui:memory:write"],
        required: {
          "gui:panel_created": this.onGuiPanelCreated,
          "memory:read": this.onMemoryRead,
          "memory:write": this.onMemoryWrite,
          "memory:write:result": this.onMemoryWriteResult,
          "ui:memory:write:result": this.onMemoryWriteResult,
          "ui:memory:bulk:write:result": this.onMemoryBulkWriteResult,
          "signal:reset": this.onReset,
        },
        optional: {
          "cpu:register_update": this.onRegisterUpdate,
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
    this.event_transceiver = eventTransceiver;
    this.id = id;

    if (!config) throw new Error(`[${this.id}] no configuration provided`);
    this.config = verify<MemoryUIConfig>(
      config,
      {
        start: { type: "number", required: true },
        size: { type: "number", required: true },
      },
      `[${this.id}] configuration error: `,
    );

    // Set the default language.
    this.setLanguage("en");

    this.updateQueue = new UpdateQueue(this.refreshUI.bind(this));

    console.log(`[${this.id}] Memory Initializing module.`);
  }

  setLanguage(language: string): void {
    this.language = language;
    this.localeStrings = MemoryUIStrings[this.language] || MemoryUIStrings.en;
  }

  onGuiPanelCreated = (panel_id: string, panel: HTMLElement, language: string): void => {
    if (this.id !== panel_id) return;
    console.log(`[${this.id}] obtained GUI panel`);

    this.panel = panel;
    this.panel.classList.add("memory-ui");

    this.setLanguage(language);
    this.createMemoryUI();
  };

  formatMemoryData(data: number): string {
    return data.toString(16).padStart(2, "0");
  }

  onRegisterUpdate = (register: string, pc: number): void => {
    if (register !== "pc") return;
    if (!this.panel || !this.memoryTable) return;

    this.pc = pc;
    this.updateQueue.queueUpdate();
  };
  onMemoryRead = (address: number): void => {
    if (!this.panel || !this.memoryTable) return;

    this.lastMemoryRead = address;
    this.updateQueue.queueUpdate();
  };
  onMemoryWrite = (address: number): void => {
    if (!this.panel || !this.memoryTable) return;

    this.lastMemoryWrite = address;
    this.updateQueue.queueUpdate();
  };

  onMemoryBulkWriteResult = (dataStart: number, data: Uint8Array): void => {
    if (!this.panel || !this.memoryTable) return;

    this.memory.set(data, dataStart);
    this.updateQueue.queueUpdate();
  };
  onMemoryWriteResult = (address: number, data: number): void => {
    if (!this.panel || !this.memoryTable) return;

    this.memory[address] = data;
    this.updateQueue.queueUpdate();
  };
  onReset = (): void => {
    if (!this.panel || !this.memoryTable) return;

    this.pc = undefined;
    this.lastMemoryRead = undefined;
    this.lastMemoryWrite = undefined;
    this.updateQueue.queueUpdate();
  };

  createMemoryUI(): void {
    if (!this.panel) return;

    this.panel.appendChild(
      element(
        "tr",
        {
          className: "virtual-row header-row",
        },
        ...Array.from({ length: 17 }).map((_, i) =>
          element("th", {
            textContent: i === 0 ? "" : `_${(i - 1).toString(16)}`,
          }),
        ),
      ),
    );
    this.memoryTable = element("virtual-list", {
      className: "memory-table",
    });
    // Add the table to the panel to initialize its properties.
    this.panel.appendChild(this.memoryTable);

    this.memoryTable.itemGenerator = this.itemGenerator;
    this.memoryTable.itemCount = 0x1000;
    this.memoryTable.itemHeight = 1.5;
    this.memoryTable.itemHeightUnits = "rem";
  }

  itemGenerator = (i: number | null, node: HTMLElement | null): HTMLElement => {
    if (node == null || i == null) {
      return element(
        "tr",
        {
          className: "virtual-row",
        },
        element("th"),
        ...Array.from({ length: 16 }).map((_, i) => element("td")),
      );
    } else {
      const row = node as HTMLTableRowElement;
      const startAddress = i * 0x10;
      const endAddress = Math.min(0x10000, startAddress + 0x10);
      const rowName = `0x${startAddress.toString(16).padStart(4, "0")}`;
      row.querySelector("th")!.textContent = rowName;
      const cells = row.querySelectorAll("td");
      for (let j = 0; j < 0x10; j++) {
        const cell = cells[j];
        const address = startAddress + j;
        if (address < endAddress) {
          cell.textContent = this.formatMemoryData(this.memory[address]);
          let className = "contrast-color";
          if (this.lastMemoryRead === address) className += " read-highlight";
          if (this.lastMemoryWrite === address) className += " write-highlight";
          if (this.pc === address) className += " pc-highlight";
          cell.className = className;
        } else {
          cell.textContent = "";
          cell.className = "";
        }
      }

      return node;
    }
  };

  refreshUI = () => {
    if (!this.memoryTable) return;
    this.memoryTable.updateContents();
  };
}

export default MemoryUI;
