import type { IModule, ModuleDeclaration } from "../../types/module";
import type { ISimulator } from "../../types/simulator";
import type { TypedEventTransceiver, EventDeclaration, EventContext } from "../../types/event";
import { element, iconButton } from "../../general/html.js";
import { createLanguageStrings } from "../../general/lang.js";
import { verify } from "../../general/config.js";

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

  // language!: string;
  // localeStrings!: typeof BreakpointsConfig.en;

  getModuleDeclaration(): ModuleDeclaration {
    return {
      events: {
        provided: ["ui:breakpoint:add", "ui:breakpoint:remove"],
        required: {
          "gui:panel_created": this.onGuiPanelCreated,
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
        iconButton("remove-all", "Remove all breakpoints", () => {}),
        iconButton("add", "Add breakpoint", () => {}),
      ),
    );
    this.list = element("div", { className: "breakpoint-list" });
    this.panel.appendChild(this.list);
  };

  addBreakpoint = (address: number, internal = true) => {
    if (!this.list) return;

    if (this.breakpoints.includes(address)) return;
    this.breakpoints.push(address);

    this.list.appendChild(
      element(
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
        element("div", { className: "address", textContent: address.toString(16) }),
      ),
    );

    if (internal) this.event_transceiver.emit("ui:breakpoint:add", address);
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
}

export default BreakpointUI;
