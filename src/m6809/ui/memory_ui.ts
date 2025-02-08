import type { IModule } from "../../types/module.js";
import type { ISimulator } from "../../types/simulator.js";
import type { EventDeclaration, TypedEventTransceiver } from "../../types/event.js";
import { element } from "../../general/html.js";
import { createLanguageStrings } from "../../general/lang.js";

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

  getEventDeclaration(): EventDeclaration {
    return {
      provided: ["ui:memory:read", "ui:memory:write"],
      required: {
        "gui:panel_created": this.onGuiPanelCreated,
        "memory:read": this.updateLastMemoryRead,
        "memory:write": this.updateLastMemoryWrite,
        "memory:write:result": this.onMemoryWriteResult,
        "ui:memory:write:result": this.onMemoryWriteResult,
        "ui:memory:bulk:write:result": this.onMemoryBulkWriteResult,
      },
      optional: {
        "cpu:register_update": this.onRegisterUpdate,
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
    const cell = this.panel.querySelector(`.byte-${pc}`);
    if (!cell) return;

    if (this.pc !== undefined) {
      const lastCell = this.panel.querySelector(`.byte-${this.pc}`);
      if (lastCell) lastCell.classList.remove("pc-highlight");
    }

    cell.classList.add("pc-highlight");
    this.pc = pc;
  };
  updateLastMemoryRead = (address: number): void => {
    if (!this.panel) return;
    if (!this.memoryTable) return;

    if (address < this.config.start || address >= this.config.start + this.config.size) return;
    const cell = this.panel.querySelector(`.byte-${address}`);
    if (!cell) return;

    if (this.lastMemoryRead !== undefined) {
      const lastCell = this.panel.querySelector(`.byte-${this.lastMemoryRead}`);
      if (lastCell) lastCell.classList.remove("read-highlight");
    }

    cell.classList.add("read-highlight");
    this.lastMemoryRead = address;
  };
  updateLastMemoryWrite = (address: number): void => {
    if (!this.panel) return;
    if (!this.memoryTable) return;

    if (address < this.config.start || address >= this.config.start + this.config.size) return;
    const cell = this.panel.querySelector(`.byte-${address}`);
    if (!cell) return;

    if (this.lastMemoryWrite !== undefined) {
      const lastCell = this.panel.querySelector(`.byte-${this.lastMemoryWrite}`);
      if (lastCell) lastCell.classList.remove("write-highlight");
    }

    cell.classList.add("write-highlight");
    this.lastMemoryWrite = address;
  };
  onMemoryBulkWriteResult = (data: Uint8Array): void => {
    if (!this.panel) return;
    if (!this.memoryTable) return;

    for (
      let addr = this.config.start;
      addr < this.config.start + this.config.size && addr < data.length;
      addr++
    ) {
      const cell = this.panel.querySelector(`.byte-${addr}`);
      if (!cell) continue;

      cell.textContent = this.formatMemoryData(data[addr]);
    }
  };
  onMemoryWriteResult = (address: number, data: number): void => {
    if (!this.panel) return;
    if (!this.memoryTable) return;

    if (address < this.config.start || address >= this.config.start + this.config.size) return;

    const cell = this.panel.querySelector(`.byte-${address}`);
    if (!cell) return;

    cell.textContent = this.formatMemoryData(data);
  };

  createMemoryUI(): void {
    if (!this.panel) return;

    const addrinput = element("input", { type: "text", placeholder: this.localeStrings.address });
    const valinput = element("input", { type: "text", placeholder: this.localeStrings.value });
    const writebutton = element("button", {
      textContent: this.localeStrings.write,
      onclick: () => {
        const address = Number.parseInt(addrinput.value, 16);
        const data = Number.parseInt(valinput.value, 16);
        if (Number.isNaN(address)) return;
        if (Number.isNaN(data)) return;
        this.event_transceiver.emit("ui:memory:write", address, data);
      },
    });
    const readbutton = element("button", {
      textContent: this.localeStrings.read,
      onclick: () => {
        const address = Number.parseInt(addrinput.value, 16);
        if (Number.isNaN(address)) return;
        this.event_transceiver.emit("ui:memory:read", address);
      },
    });

    const output = element("div", { className: "memory-output" });

    this.panel.appendChild(element("div", addrinput, valinput, writebutton, readbutton, output));

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
          }),
        );
      }
      this.memoryTable.appendChild(row);
    }

    this.panel.appendChild(this.memoryTable);
  }
}

export default MemoryUI;
