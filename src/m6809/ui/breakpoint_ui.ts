import type { IModule, ModuleDeclaration } from "../../types/module";
import type { ISimulator } from "../../types/simulator";
import type { TypedEventTransceiver, EventDeclaration, EventContext } from "../../types/event";
import { element, iconButton } from "../../general/html.js";
import { createLanguageStrings } from "../../general/lang.js";
import { verify } from "../../general/config.js";
import type { Registers } from "../util/cpu_parts";
import { UpdateQueue } from "../../general/updatequeue.js";

type BreakpointUIConfig = {
  frequency: number;
};

const BreakpointUIStrings = createLanguageStrings({
  en: {
    removeAllBreakpoint: "Remove all breakpoints",
    addBreakpoint: "Add breakpoint",
    removeBreakpoint: "Remove breakpoint",
    enterAddress: "Enter address to add the breakpoint to:",
  },
  es: {
    removeAllBreakpoint: "Eliminar todos los puntos de ruptura",
    addBreakpoint: "Añadir punto de ruptura",
    removeBreakpoint: "Eliminar punto de ruptura",
    enterAddress: "Introduce la dirección en la que añadir el punto de ruptura:",
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

    console.log(`[${this.id}] Module initialized.`);
  }

  setLanguage(language: string): void {
    this.language = language;
    this.localeStrings = BreakpointUIStrings[this.language] || BreakpointUIStrings.en;
  }

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
          const address = prompt(this.localeStrings.enterAddress);
          if (address) this.addBreakpoint(Number(address));
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
    if (!this.list) return;

    if (this.breakpoints.includes(address)) return;
    this.breakpoints.push(address);
    this.breakpoints.sort((a, b) => a - b);

    this.updateQueue.queueUpdate({ type: "add", address });

    if (internal) this.event_transceiver.emit("ui:breakpoint:add", address);
  };
  removeBreakpoint = (address: number, internal = true) => {
    if (!this.list) return;

    if (!this.breakpoints.includes(address)) return;
    this.breakpoints = this.breakpoints.filter((a) => a !== address);

    this.updateQueue.queueUpdate({ type: "remove", address });

    if (internal) this.event_transceiver.emit("ui:breakpoint:remove", address);
  };

  onRegistersUpdate = (registers: Registers) => {
    if (!this.panel) return;

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

export default BreakpointUI;
