import type { IModule } from "../../types/module";
import type { ISimulator } from "../../types/simulator";
import type { TypedEventTransceiver, EventDeclaration } from "../../types/event";
import { element } from "../../utils.js";

type ScreenConfig = {
  address: number;
};

function validateScreenConfig(config: Record<string, unknown>): ScreenConfig {
  if (typeof config.address !== "number") throw new Error("[Screen] address must be a number");

  return config as ScreenConfig;
}

class Screen implements IModule {
  id: string;
  event_transceiver: TypedEventTransceiver;
  config: ScreenConfig;

  panel?: HTMLElement;

  textElement?: HTMLElement;

  getEventDeclaration(): EventDeclaration {
    return {
      provided: [],
      required: {
        "signal:reset": this.onReset,
        "memory:write": this.onMemoryWrite,
        "gui:panel_created": this.onGuiPanelCreated,
      },
      optional: {},
    };
  }

  constructor(
    id: string,
    config: Record<string, unknown>,
    eventTransceiver: TypedEventTransceiver,
  ) {
    this.id = id;
    this.event_transceiver = eventTransceiver;

    this.config = validateScreenConfig(config);

    console.log(`[${this.id}] Module initialized.`);
  }

  onReset = (): void => {
    if (!this.textElement) return;
    this.textElement.textContent = "";
  };

  onMemoryWrite = (address: number, data: number): void => {
    if (address !== this.config.address) return;
    if (!this.textElement) return;

    this.textElement.textContent += String.fromCharCode(data);
  };

  onGuiPanelCreated = (panel_id: string, panel: HTMLElement): void => {
    if (panel_id !== this.id) return;
    this.panel = panel;

    this.panel.classList.add("screen");

    this.panel.appendChild(element("h2", { properties: { textContent: "Screen" } }));

    this.textElement = element("pre", { properties: { textContent: "" } });

    this.panel.appendChild(this.textElement);
  };
}

export default Screen;
