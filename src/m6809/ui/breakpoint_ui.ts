import type { IModule, ModuleDeclaration } from "../../types/module";
import type { ISimulator } from "../../types/simulator";
import type { TypedEventTransceiver, EventDeclaration, EventContext } from "../../types/event";
import { element, iconButton } from "../../general/html.js";
import { createLanguageStrings } from "../../general/lang.js";
import { verify } from "../../general/config.js";
import { Registers } from "../util/cpu_parts";

type BreakpointUIConfig = {
  frequency: number;
};

class BreakpointUI implements IModule {
  id: string;
  event_transceiver: TypedEventTransceiver;

  config: BreakpointUIConfig;

  panel?: HTMLElement;
  list?: HTMLElement;

  breakpoints: number[] = [];

  registers?: Registers;

  // language!: string;
  // localeStrings!: typeof BreakpointsConfig.en;

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

    console.log(`[${this.id}] Module initialized.`);
  }

  onGuiPanelCreated = (panel_id: string, panel: HTMLElement, language: string) => {
    if (panel_id !== this.id) return;

    this.panel = panel;
    this.panel.classList.add("breakpoint-ui");

    this.panel.appendChild(
      element(
        "div",
        { className: "breakpoint-buttons" },
        iconButton("remove-all", "Remove all breakpoints", () => {
          for (const address of this.breakpoints) {
            this.removeBreakpoint(address);
          }
        }),
        iconButton("add", "Add breakpoint", () => {
          const address = prompt("Enter address to add breakpoint to:");
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

  addBreakpoint = (address: number, internal = true) => {
    if (!this.list) return;

    if (this.breakpoints.includes(address)) return;
    this.breakpoints.push(address);
    this.breakpoints.sort((a, b) => a - b);

    const newRow = element(
      "div",
      {
        className: "row",
        customAttributes: { "data-address": address.toString() },
      },
      element(
        "div",
        { className: "row-buttons" },
        iconButton("remove-one", "Remove breakpoint", () => this.removeBreakpoint(address)),
      ),
      element("div", { className: "address", textContent: this.formatAddress(address) }),
    );
    this.addRowOrdered(newRow);

    if (internal) this.event_transceiver.emit("ui:breakpoint:add", address);
  };

  formatAddress = (data: number): string => {
    return data.toString(16).padStart(4, "0");
  };

  onBreakpointAdd = (address: number, ctx: EventContext) => {
    if (ctx.emitter === this.id) return;
    this.addBreakpoint(address, false);
  };

  removeBreakpoint = (address: number, internal = true) => {
    if (!this.list) return;

    if (!this.breakpoints.includes(address)) return;
    this.breakpoints = this.breakpoints.filter((a) => a !== address);

    const row = this.list.querySelector(`.row[data-address="${address}"]`);
    if (row) row.remove();

    if (internal) this.event_transceiver.emit("ui:breakpoint:remove", address);
  };

  onBreakpointRemove = (address: number, ctx: EventContext) => {
    this.removeBreakpoint(address, false);
  };

  onRegistersUpdate = (registers: Registers) => {
    if (!this.panel) return;

    this.registers = registers.copy();
  };

  onInstructionFinish = () => {
    if (!this.registers) return;

    if (this.breakpoints.includes(this.registers.pc)) this.event_transceiver.emit("ui:clock:pause");
  };
}

export default BreakpointUI;
