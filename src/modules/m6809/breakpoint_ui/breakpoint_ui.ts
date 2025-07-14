import { verify } from "../../../utils/config.js";
import { element, iconButton } from "../../../utils/html.js";
import { createLanguageStrings } from "../../../utils/lang.js";
import { UpdateQueue } from "../../../utils/updatequeue.js";
import type {
  EventContext,
  EventDeclaration,
  TypedEventTransceiver,
} from "../../../types/event.js";
import type { IModule, ModuleDeclaration } from "../../../types/module.js";
import type { ISimulator } from "../../../types/simulator.js";
import type { Registers } from "../cpu/cpu_parts.js";

type BreakpointUIConfig = Record<string, never>; // no config options for now

const BreakpointUIStrings = createLanguageStrings({
  en: {
    removeAllBreakpoint: "Remove all breakpoints",
    addBreakpoint: "Add breakpoint",
    removeBreakpoint: "Remove breakpoint",
    enterAddress: "Enter an address, symbol or symbol offset to add a breakpoint at:",
    invalidAddress:
      "Invalid address format. Please enter a valid hex address, symbol or symbol offset.",
  },
  es: {
    removeAllBreakpoint: "Eliminar todos los puntos de ruptura",
    addBreakpoint: "Añadir punto de ruptura",
    removeBreakpoint: "Eliminar punto de ruptura",
    enterAddress:
      "Introduce la dirección, símbolo o símbolo con desplazamiento en el que añadir el punto de ruptura:",
    invalidAddress:
      "Formato de dirección inválido. Por favor, introduce una dirección hexadecimal, un símbolo o un símbolo con desplazamiento válidos.",
  },
});

type UpdateQueueElement = {
  type: "add" | "remove";
  address: number;
};
class BreakpointUI implements IModule {
  id: string;
  event_transceiver: TypedEventTransceiver;

  config: BreakpointUIConfig;

  panel?: HTMLElement;
  list?: HTMLElement;

  breakpoints: number[] = [];
  symbolMap: Record<string, number>;

  registers?: Registers;

  language!: string;
  localeStrings!: typeof BreakpointUIStrings.en;

  updateQueue: UpdateQueue<UpdateQueueElement>;

  getModuleDeclaration(): ModuleDeclaration {
    return {
      events: {
        provided: ["ui:breakpoint:add", "ui:breakpoint:remove", "ui:clock:pause"],
        required: {
          "gui:panel_created": this.onGuiPanelCreated,
          "cpu:registers_update": this.onRegistersUpdate,
          "cpu:instruction_finish": this.onInstructionFinish,
        },
        optional: {
          "ui:breakpoint:add": this.onBreakpointAdd,
          "ui:breakpoint:remove": this.onBreakpointRemove,
          "dbg:symbol:add": this.onAddSymbol,
          "dbg:symbol:clear": this.onClearSymbols,
        },
      },
      cycles: {
        permanent: [],
      },
    };
  }

  constructor(
    id: string,
    config: Record<string, unknown>,
    eventTransceiver: TypedEventTransceiver,
  ) {
    this.id = id;
    this.event_transceiver = eventTransceiver;

    this.config = verify(config, {}, `[${this.id}] configuration error: `);

    this.updateQueue = new UpdateQueue(this.refreshUI.bind(this));

    this.symbolMap = {};

    console.log(`[${this.id}] Module initialized.`);
  }

  setLanguage(language: string): void {
    this.language = language;
    this.localeStrings = BreakpointUIStrings[this.language] || BreakpointUIStrings.en;
  }

  onAddSymbol = (symbol: string, address: number) => {
    this.symbolMap[symbol] = address;
  };
  onClearSymbols = () => {
    this.symbolMap = {};
  };

  onGuiPanelCreated = (panel_id: string, panel: HTMLElement, language: string) => {
    if (panel_id !== this.id) return;

    this.panel = panel;
    this.panel.classList.add("breakpoint-ui");

    this.setLanguage(language);

    this.panel.appendChild(
      element(
        "div",
        { className: "breakpoint-buttons" },
        iconButton("remove-all", this.localeStrings.removeAllBreakpoint, () => {
          for (const address of this.breakpoints) {
            this.removeBreakpoint(address);
          }
        }),
        iconButton("add", this.localeStrings.addBreakpoint, () => {
          const userInput = prompt(this.localeStrings.enterAddress);
          if (!userInput) return;
          const address = parseAddress(userInput, this.symbolMap);
          if (address == null) return alert(this.localeStrings.invalidAddress);
          this.addBreakpoint(address);
        }),
      ),
    );
    this.list = element("div", { className: "breakpoint-list" });
    this.panel.appendChild(this.list);
  };

  addRowOrdered = (row: HTMLElement) => {
    if (!this.list) return;

    const address = Number.parseInt(row.getAttribute("data-address") ?? "0");
    const rows = this.list.querySelectorAll(".row");
    let inserted = false;

    for (const r of Array.from(rows)) {
      const raddress = Number.parseInt(r.getAttribute("data-address") ?? "0");
      if (address < raddress) {
        this.list.insertBefore(row, r);
        inserted = true;
        break;
      }
    }

    if (!inserted) {
      this.list.appendChild(row);
    }
  };

  formatAddress = (data: number): string => {
    return data.toString(16).padStart(4, "0");
  };

  onBreakpointAdd = (address: number, ctx: EventContext) => {
    if (ctx.emitter === this.id) return;
    this.addBreakpoint(address, false);
  };
  onBreakpointRemove = (address: number, ctx: EventContext) => {
    if (ctx.emitter === this.id) return;
    this.removeBreakpoint(address, false);
  };

  addBreakpoint = (address: number, internal = true) => {
    if (this.breakpoints.includes(address)) return;
    this.breakpoints.push(address);
    this.breakpoints.sort((a, b) => a - b);

    if (!this.list) return;
    this.updateQueue.queueUpdate({ type: "add", address });

    if (internal) this.event_transceiver.emit("ui:breakpoint:add", address);
  };
  removeBreakpoint = (address: number, internal = true) => {
    if (!this.breakpoints.includes(address)) return;
    this.breakpoints = this.breakpoints.filter((a) => a !== address);

    if (!this.list) return;
    this.updateQueue.queueUpdate({ type: "remove", address });

    if (internal) this.event_transceiver.emit("ui:breakpoint:remove", address);
  };

  onRegistersUpdate = (registers: Registers) => {
    this.registers = registers.copy();
  };

  onInstructionFinish = () => {
    if (!this.registers) return;

    if (this.breakpoints.includes(this.registers.pc)) this.event_transceiver.emit("ui:clock:pause");
  };

  refreshUI = async (queue: UpdateQueueElement[]) => {
    if (!this.list) return;

    for (const update of queue) {
      if (update.type === "add") {
        const newRow = element(
          "div",
          {
            className: "row",
            customAttributes: { "data-address": update.address.toString() },
          },
          element(
            "div",
            { className: "row-buttons" },
            iconButton("remove-one", this.localeStrings.removeBreakpoint, () =>
              this.removeBreakpoint(update.address),
            ),
          ),
          element("div", { className: "address", textContent: this.formatAddress(update.address) }),
        );
        this.addRowOrdered(newRow);
      } else if (update.type === "remove") {
        const row = this.list.querySelector(`.row[data-address="${update.address}"]`);
        if (row) row.remove();
      }
    }
  };
}

/**
 * Parses the input string as a hex number (address) or a symbol and an offset.
 * Example inputs:
 * - "0x1234" -> 0x1234
 * - "1234" -> 0x1234
 * (taking label=0x1000)
 * - "label+0x10" or "label+10" -> 0x1010
 * - "label-0x10" or "label-10" -> 0x0ff0
 * - "label" -> 0x1000
 * @param input The user input string.
 * @param symbols A object of symbols to addresses, where the key is the symbol
 * name
 * @returns The parsed address as a number, or null if the input is invalid.
 * @example
 * parseAddress("0x1234", {}); // returns 4660
 * parseAddress("1234", {}); // returns 4660
 * parseAddress("label+0x10", { label: 0x1000 }); // returns 4112
 * parseAddress("label-0x10", { label: 0x1000 }); // returns 4096
 * parseAddress("label", { label: 0x1000 }); // returns 4096
 */
function parseAddress(input: string, symbols: Record<string, number>): number | null {
  const isNumber = input.match(/^(?:0x)?[0-9a-fA-F]+$/);

  // If the input is a valid number, we just return it.
  if (isNumber) return Number.parseInt(input, 16);

  // If the input is not a number, we try to parse it as a symbol with an
  // offset.
  const match = input.match(/^([^+-]*)(?:([+-])((?:0x)?[0-9a-fA-F]+))?$/);
  if (!match) return null;

  const symbol = match[1];
  const operator = match[2] || "+";
  const offset = Number.parseInt(match[3], 16) || 0;
  if (!(symbol in symbols) || Number.isNaN(offset) || !Number.isFinite(offset)) return null;
  const baseAddress = symbols[symbol];
  if (operator === "+") return baseAddress + offset;
  else return baseAddress - offset;
}

export default BreakpointUI;
