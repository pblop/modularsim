import type { IModule } from "../../types/module";
import type { TypedEventTransceiver, EventDeclaration } from "../../types/event";
import { element } from "../../general/html.js";
import { verify } from "../../general/config.js";

type ScreenConfig = {
  address: number;
};

class ScreenUI implements IModule {
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

    this.config = verify(config, {
      address: {
        type: "number",
        required: true,
      },
    });

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

    this.panel.classList.add("screen-ui");

    this.panel.appendChild(element("h2", { textContent: "Screen" }));

    this.textElement = element("pre", { textContent: "" });

    this.panel.appendChild(this.textElement);
  };
}

export default ScreenUI;
