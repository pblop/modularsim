import type { IModule } from "../../types/module.js";
import type { ISimulator } from "../../types/simulator.js";
import type { EventDeclaration, TypedEventTransceiver } from "../../types/event.js";
import { element } from "../../utils.js";
import { timeAgo } from "../../general/dates.js";

type GuiPanelConfig = {
  id: string; // Id of the module being loaded.
  column: string | number;
  row: string | number;
};

type GuiConfig = {
  panels: GuiPanelConfig[];
};

function validate_gui_panel_config(config: Record<string, unknown>): GuiPanelConfig {
  if (typeof config.id !== "string") throw new Error("[GUI] panel id must be a string");
  if (typeof config.column !== "string" && typeof config.column !== "number")
    throw new Error("[GUI] panel column must be a string or number");
  if (typeof config.row !== "string" && typeof config.row !== "number")
    throw new Error("[GUI] panel row must be a string or number");
  return config as GuiPanelConfig;
}
function validate_gui_config(config: Record<string, unknown>): GuiConfig {
  if (!Array.isArray(config.panels)) throw new Error("[GUI] panels must be an array");
  config.panels = config.panels.map((panel) => validate_gui_panel_config(panel));

  return config as GuiConfig;
}

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

    this.config = validate_gui_config(config);

    // Get the root element where the GUI will be rendered.
    const root_element = document.getElementById("root");
    if (root_element == null) throw new Error(`[${this.id}] Root element found`);
    root_element.classList.add("gui-root");
    this.root_element = root_element;

    this.createDeploymentInfoElement();

    console.log(`[${this.id}] Module initialized.`);
  }

  createDeploymentInfoElement() {
    fetch("deployment-info.json")
      .then((r) => r.json())
      .then((info) => {
        const date = new Date(info.date);
        const deployment_info_element = element("div", {
          properties: {
            className: "deployment-info",
            innerText: `${info.commit.slice(0, 7)} (${timeAgo(date)})`,
            title: info.message,
          },
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
        properties: {
          id: `panel_${panel.id}`,
          className: "gui-panel",
        },
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
