import type { IModule, ModuleDeclaration } from "../../types/module.js";
import type { ISimulator } from "../../types/simulator.js";
import type { EventDeclaration, TypedEventTransceiver } from "../../types/event.js";
import { element } from "../../general/html.js";
import { createLanguageStrings } from "../../general/lang.js";
import { UpdateQueue } from "../../general/updatequeue.js";

type MemoryUIConfig = {
  start: number;
  size: number;
};

function validateMemoryUIConfig(config: Record<string, unknown>): MemoryUIConfig {
  if (typeof config.start !== "number") throw new Error("[MemoryUI] start must be a number");
  if (typeof config.size !== "number") throw new Error("[MemoryUI] size must be a number");

  return config as MemoryUIConfig;
}

const MemoryUIStrings = createLanguageStrings({
  en: {
    address: "Memory address",
    value: "Value",
    write: "Write",
    read: "Read",
  },
  es: {
    address: "Dirección de memoria",
    value: "Valor",
    write: "Escribir",
    read: "Leer",
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
  memoryTable?: HTMLTableElement;

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

    if (!config) throw new Error(`[${this.id}] No configuration provided`);
    this.config = validateMemoryUIConfig(config);

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

    // If the bulk write is completely outside the memory table, we can ignore
    // it.
    if (dataStart >= this.config.start + this.config.size) return;

    this.updateQueue.queueUpdate({ type: "bulk_write", address: dataStart, data });
  };
  onMemoryWriteResult = (address: number, data: number): void => {
    if (!this.panel) return;
    if (!this.memoryTable) return;

    if (address < this.config.start || address >= this.config.start + this.config.size) return;

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

    this.memoryTable = element(
      "table",
      { className: "memory-table" },
      element(
        "tr",
        ...Array.from({ length: 17 }).map((_, i) =>
          element("th", {
            textContent: i === 0 ? "" : `_${(i - 1).toString(16)}`,
          }),
        ),
      ),
    );

    for (let i = this.config.start; i < this.config.start + this.config.size; i += 16) {
      const rowName = `0x${i.toString(16).padStart(4, "0")}`;
      const row = element("tr", element("th", { textContent: rowName }));
      for (let j = i; j < i + 16 && j < this.config.start + this.config.size; j++) {
        row.appendChild(
          element("td", {
            className: `byte-${j} contrast-color`,
            textContent: this.formatMemoryData(0),
            title: `0x${j.toString(16).padStart(4, "0")}`,
            onClick: (el) => {
              // If the cell already has a child element, we will ignore the click.
              if (el.childElementCount > 0) return;

              const text = el.textContent!;

              // Create an input element to edit the memory value (in place)
              const input = element("input", {
                value: text,
                onblur: () => {
                  // When the input loses focus, we will remove the input element
                  // and restore the text content of the cell.
                  // This happens when the user clicks outside the input element
                  // or presses Enter!
                  input.remove();
                  el.textContent = text;
                },
                onkeyup: ({ key }) => {
                  if (key === "Enter") {
                    // If the text hasn't changed, we don't have to do anything.
                    if (text === input.value) {
                      input.blur();
                      return;
                    }

                    // When the user presses Enter, we will parse the input value,
                    // and emit a memory write event.
                    const data = Number.parseInt(input.value, 16);
                    if (Number.isNaN(data)) return;
                    if (data < 0 || data > 0xff) return;

                    // We will receive the result of the write operation in the
                    // `ui:memory:write:result` event, and will update the memory
                    // cell accordingly, then.
                    this.event_transceiver.emit("ui:memory:write", j, data);
                  } else if (key === "Escape") {
                    input.blur();
                  }
                },
              });

              // Clear the text content of the cell and append the input element.
              el.textContent = "";
              el.appendChild(input);

              input.focus();
            },
          }),
        );
      }
      this.memoryTable.appendChild(row);
    }

    this.panel.appendChild(this.memoryTable);
  }

  refreshUI = async (queue: UpdateQueueElement[]) => {
    // We only need the last update of each type.
    const updates = new Map<string, UpdateQueueElement>();
    for (const update of queue) {
      updates.set(update.type, update);
    }

    for (const [_, update] of updates) {
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
    this.panel.querySelector(`.${highlightClassName}`)?.classList.remove(highlightClassName);

    if (address === undefined) return;

    // Find the cell corresponding to the new address and highlight it.
    this.panel.querySelector(`.byte-${address}`)?.classList.add(highlightClassName);
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
      const cell = this.panel.querySelector(`.byte-${address}`);
      if (!cell) continue;

      cell.textContent = this.formatMemoryData(data[address - dataStart]);
    }
  }
  updateMemory(address: number, data: number): void {
    if (!this.panel) return;

    const cell = this.panel.querySelector(`.byte-${address}`);
    if (!cell) return;

    cell.textContent = this.formatMemoryData(data);
  }
}

export default MemoryUI;
