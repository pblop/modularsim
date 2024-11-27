import type { IModule } from "../types/module.js";
import type { ISimulator } from "../types/simulator.js";
import type { EventDeclaration, TypedEventTransceiver } from "../types/event.js";

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
  panels: GuiPanelConfig[] = [];

  getEventDeclaration(): EventDeclaration {
    return {
      provided: [],
      required: [],
      optional: [],
    };
  }

  constructor(config: Record<string, unknown> | undefined, simulator: ISimulator) {
    console.log("[GUI] Initializing module.");

    // We use the simulator to emit/receive events.
    this.event_transceiver = simulator;

    // Verify that configuration is ok.
    if (!config) throw new Error("[GUI] No configuration provided");

    const parsed_config = validate_gui_config(config);
    this.panels = parsed_config.panels;

    this.addListeners();
    console.log("[GUI] Initialized GUI");
  }

  addListeners(): void {}
}

export default Gui;
