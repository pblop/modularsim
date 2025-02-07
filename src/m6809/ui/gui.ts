import type { IModule } from "../../types/module.js";
import type { ISimulator } from "../../types/simulator.js";
import type { EventDeclaration, TypedEventTransceiver } from "../../types/event.js";
import { element } from "../../general/html.js";
import { timeAgo } from "../../general/dates.js";
import { type ObjectSchema, verify } from "../../general/config.js";

type GuiPanelConfig = {
  id: string; // Id of the module being loaded.
  column: string | number;
  row: string | number;
};
type GuiColors = {
  background: string;
  foreground: string;
  text: string;
  border: string;
  highlight: string;
};
type GuiConfig = {
  panels: GuiPanelConfig[];
  colors: {
    dark: GuiColors;
    light: GuiColors;
    default: "dark" | "light";
  };
};

const GUI_COLOR_SCHEMA: ObjectSchema = {
  type: "object",
  required: false,
  default: {
    background: "#ffffff",
    foreground: "#000000",
    text: "#000000",
    border: "#000000",
    highlight: "#cccccc",
  },
  properties: {
    background: { type: "string", required: true },
    foreground: { type: "string", required: true },
    text: { type: "string", required: true },
    border: { type: "string", required: true },
    highlight: { type: "string", required: true },
  },
};

class Gui implements IModule {
  event_transceiver: TypedEventTransceiver;
  config: GuiConfig;
  id: string;

  root_element: HTMLElement;

  getEventDeclaration(): EventDeclaration {
    return {
      provided: ["gui:panel_created"],
      required: { "system:load_finish": this.onSystemLoadFinish },
      optional: {},
    };
  }

  // TODO: Change the cases of the variables to camelCase.
  constructor(
    id: string,
    config: Record<string, unknown> | undefined,
    eventTransceiver: TypedEventTransceiver,
  ) {
    // We use the simulator to emit/receive events.
    this.event_transceiver = eventTransceiver;
    this.id = id;

    console.log(`[${this.id}] Initializing module.`);

    // Verify that configuration is ok.
    if (!config) throw new Error(`[${this.id}] No configuration provided`);

    this.config = verify(
      config,
      {
        colors: {
          type: "object",
          required: false,
          default: {
            light: {
              background: "#ffffff",
              foreground: "#000000",
              text: "#000000",
              border: "#000000",
              highlight: "#cccccc",
            },
            default: "light",
          },
          properties: {
            dark: GUI_COLOR_SCHEMA,
            light: GUI_COLOR_SCHEMA,
            default: {
              type: "string",
              default: "light",
              enum: ["dark", "light"],
            },
          },
        },
        panels: {
          type: "array",
          schema: {
            type: "object",
            properties: {
              id: { type: "string", required: true },
              column: { type: "string" },
              row: { type: "string" },
            },
          },
        },
      },
      `[${this.id}] configuration error: `,
    );

    // Get the root element where the GUI will be rendered.
    const root_element = document.getElementById("root");
    if (root_element == null) throw new Error(`[${this.id}] Root element found`);
    root_element.classList.add("gui-root");
    this.root_element = root_element;

    this.createDeploymentInfoElement();

    const colors = this.config.colors[this.config.colors.default];
    for (const [key, value] of Object.entries(colors)) {
      root_element.style.setProperty(`--gui-color-${key}`, value);
    }

    console.log(`[${this.id}] Module initialized.`);
  }

  createDeploymentInfoElement() {
    fetch("deployment-info.json")
      .then((r) => r.json())
      .then((info) => {
        const date = new Date(info.date);
        const deployment_info_element = element("div", {
          className: "deployment-info",
          innerText: `${info.commit.slice(0, 7)} (${timeAgo(date)})`,
          title: `${info.message}\n\n${info.body ?? ""}`.trimEnd(),
        });
        this.root_element.appendChild(deployment_info_element);
      })
      .catch(() => {});
  }

  onSystemLoadFinish = (): void => {
    // Now that the system is loaded, we can start rendering the GUI, and (most importantly) tell
    // the other modules that the GUI is ready, and what their panel ids are.
    console.log(`[${this.id}] Creating GUI panels`);
    for (const panel of this.config.panels) {
      console.log(`[${this.id}] Creating panel ${panel.id}`);

      const panel_element = element("div", {
        id: `panel_${panel.id}`,
        className: "gui-panel",
        style: {
          gridColumn: `${panel.column}`,
          gridRow: `${panel.row}`,
        },
      });
      this.root_element.appendChild(panel_element);

      // Notify other modules that the panel has been created
      this.event_transceiver.emit("gui:panel_created", panel.id, panel_element);
    }
  };
}

export default Gui;
