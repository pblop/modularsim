import type { IModule } from "../types/module.js";
import type { ISimulator } from "../types/simulator.js";
import type { EventDeclaration, TypedEventTransceiver } from "../types/event.js";
import { setStyle } from "../utils.js";

type GuiPanelConfig = {
  id: string; // Id of the module being loaded.
  width: number;
  height: number;
  x: number;
  y: number;
};

type GuiConfig = {
  panels: GuiPanelConfig[];
};

function validate_gui_panel_config(config: Record<string, unknown>): GuiPanelConfig {
  if (typeof config.id !== "string") throw new Error("[GUI] panel id must be a string");
  if (typeof config.width !== "number") throw new Error("[GUI] panel width must be a number");
  if (typeof config.height !== "number") throw new Error("[GUI] panel height must be a number");
  if (typeof config.x !== "number") throw new Error("[GUI] panel x must be a number");
  if (typeof config.y !== "number") throw new Error("[GUI] panel y must be a number");
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
      required: ["system:load_finish"],
      optional: [],
    };
  }

  constructor(id: string, config: Record<string, unknown> | undefined, simulator: ISimulator) {
    // We use the simulator to emit/receive events.
    this.event_transceiver = simulator;
    this.id = id;

    console.log(`[${this.id}] Initializing module.`);

    // Verify that configuration is ok.
    if (!config) throw new Error(`[${this.id}] No configuration provided`);

    this.config = validate_gui_config(config);

    // Get the root element where the GUI will be rendered.
    const root_element = document.getElementById("root");
    if (root_element == null) throw new Error(`[${this.id}] Root element found`);
    this.root_element = root_element;

    this.addListeners();
    console.log(`[${this.id}] Module initialized.`);
  }

  addListeners(): void {
    this.event_transceiver.on("system:load_finish", this.onSystemLoadFinish);
  }

  onSystemLoadFinish = (): void => {
    // Now that the system is loaded, we can start rendering the GUI, and (most importantly) tell
    // the other modules that the GUI is ready, and what their panel ids are.
    console.log(`[${this.id}] Creating GUI panels`);
    for (const panel of this.config.panels) {
      console.log(`[${this.id}] Creating panel ${panel.id}`);

      const panel_element = document.createElement("div");
      panel_element.id = `panel_${panel.id}`;
      setStyle(panel_element, {
        width: `${panel.width}px`,
        height: `${panel.height}px`,
        position: "absolute",
        left: `${panel.x}px`,
        top: `${panel.y}px`,
      });
      panel_element.classList.add("gui-panel");
      this.root_element.appendChild(panel_element);

      // Notify other modules that the panel has been created
      this.event_transceiver.emit("gui:panel_created", panel.id, panel_element);
    }
  };
}

export default Gui;
