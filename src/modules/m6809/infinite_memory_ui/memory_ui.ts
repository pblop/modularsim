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

  updateQueue: UpdateQueue<UpdateQueueElement>;

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

    if (pc < this.config.start || pc >= this.config.start + this.config.size) return;

    this.updateQueue.queueUpdate({ type: "pc", address: pc });
  };
  onMemoryRead = (address: number): void => {
    if (!this.panel) return;
    if (!this.memoryTable) return;

    if (address < this.config.start || address >= this.config.start + this.config.size) return;

    this.updateQueue.queueUpdate({ type: "read", address });
  };
  onMemoryWrite = (address: number): void => {
    if (!this.panel) return;
    if (!this.memoryTable) return;

    if (address < this.config.start || address >= this.config.start + this.config.size) return;

    this.updateQueue.queueUpdate({ type: "write", address });
  };

  onMemoryBulkWriteResult = (dataStart: number, data: Uint8Array): void => {
    if (!this.panel) return;
    if (!this.memoryTable) return;

    this.memory.set(data, dataStart);

    this.updateQueue.queueUpdate({ type: "bulk_write", address: dataStart, data });
  };
  onMemoryWriteResult = (address: number, data: number): void => {
    if (!this.panel) return;
    if (!this.memoryTable) return;

    this.memory[address] = data;

    this.updateQueue.queueUpdate({ type: "write_result", address, data });
  };
  onReset = (): void => {
    if (!this.panel) return;
    if (!this.memoryTable) return;

    this.updateQueue.queueUpdate({ type: "pc", address: undefined });
    this.updateQueue.queueUpdate({ type: "read", address: undefined });
    this.updateQueue.queueUpdate({ type: "write", address: undefined });
  };

  createMemoryUI(): void {
    if (!this.panel) return;

    this.panel.appendChild(
      element(
        "tr",
        {
          className: "header-row",
        },
        element("th", { textContent: "0x0000" }),
        ...Array.from({ length: 16 }).map((_, i) =>
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
    this.memoryTable.itemCount = 0x1000; // +1 to include the header row
    // this.memoryTable = element(
    //   "table",
    //   { className: "memory-table" },
    //   element(
    //     "tr",
    //     ...Array.from({ length: 17 }).map((_, i) =>
    //       element("th", {
    //         textContent: i === 0 ? "" : `_${(i - 1).toString(16)}`,
    //       }),
    //     ),
    //   ),
    // );

    // for (let i = this.config.start; i < this.config.start + this.config.size; i += 16) {
    //   const rowName = `0x${i.toString(16).padStart(4, "0")}`;
    //   const row = element("tr", element("th", { textContent: rowName }));
    //   for (let j = i; j < i + 16 && j < this.config.start + this.config.size; j++) {
    //     row.appendChild(
    //       rewrittableTableElement(
    //         {
    //           className: `byte-${j} contrast-color`,
    //           textContent: this.formatMemoryData(0),
    //           title: `0x${j.toString(16).padStart(4, "0")}`,
    //         },
    //         this.localeStrings,
    //         (newValue) => {
    //           // We will receive the result of the write operation in the
    //           // `ui:memory:write:result` event, and will update the memory
    //           // cell accordingly, then.
    //           this.event_transceiver.emit("ui:memory:write", j, newValue);
    //         },
    //         1,
    //       ),
    //     );
    //   }
    //   this.memoryTable.appendChild(row);
    // }
  }

  itemGenerator = (i: number | null, node: HTMLElement | null): HTMLElement => {
    if (node == null || i == null) {
      return element(
        "tr",
        {
          className: "virtual-row",
        },
        element("th"),
        ...Array.from({ length: 17 }).map((_, i) => element("td")),
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
        if (address < endAddress) cell.textContent = this.formatMemoryData(this.memory[address]);
        else cell.textContent = "";
      }

      return node;
    }
  };

  refreshUI = async (queue: UpdateQueueElement[]) => {
    // We only need the last update of the read/write/pc types.
    let hasRead = false;
    let hasWrite = false;
    let hasPC = false;

    for (let i = queue.length - 1; i >= 0; i--) {
      const type = queue[i].type;
      if (type === "read") {
        if (hasRead) queue.splice(i, 1);
        else hasRead = true;
      } else if (type === "write") {
        if (hasWrite) queue.splice(i, 1);
        else hasWrite = true;
      } else if (type === "pc") {
        if (hasPC) queue.splice(i, 1);
        else hasPC = true;
      }
    }

    for (const update of queue) {
      switch (update.type) {
        case "read":
          this.updateHighlight(update.address, "read-highlight");
          break;
        case "write":
          this.updateHighlight(update.address, "write-highlight");
          break;
        case "write_result":
          this.updateMemory(update.address, update.data);
          break;
        case "pc":
          this.updateHighlight(update.address, "pc-highlight");
          break;
        case "bulk_write":
          this.bulkUpdateMemory(update.address, update.data);
          break;
      }
    }
  };

  updateHighlight(address: number | undefined, highlightClassName: string): void {
    if (!this.panel || !this.memoryTable) return;

    // Clear the previous address highlight.
    // this.panel.querySelector(`.${highlightClassName}`)?.classList.remove(highlightClassName);

    if (address === undefined) return;

    // Find the cell corresponding to the new address and highlight it.
    // this.panel.querySelector(`.byte-${address}`)?.classList.add(highlightClassName);
  }
  bulkUpdateMemory(dataStart: number, data: Uint8Array): void {
    if (!this.panel) return;

    const dataEnd = dataStart + data.length;

    // If the start of the bulk write is before the start of the memory table,
    // we will start from the start of the memory table.
    // Otherwise, if the start of the bulk write is after the start of the
    // memory table, we will start from the start of the bulk write.
    const initial = Math.max(dataStart, this.config.start);

    for (
      let address = initial;
      // We will iterate until the end of the memory table or the end of the
      // bulk write, whichever comes first.
      address < this.config.start + this.config.size && address < dataEnd;
      address++
    ) {
      // const cell = this.panel.querySelector(`.byte-${address}`);
      // if (!cell) continue;
      // cell.textContent = this.formatMemoryData(data[address - dataStart]);
    }
  }
  updateMemory(address: number, data: number): void {
    if (!this.panel) return;

    // const cell = this.panel.querySelector(`.byte-${address}`);
    // if (!cell) return;

    // cell.textContent = this.formatMemoryData(data);
  }
}

export default MemoryUI;
