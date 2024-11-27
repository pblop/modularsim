import type { IModule } from "../types/module.js";
import type { ISimulator } from "../types/simulator.js";
import type { EventDeclaration, TypedEventTransceiver } from "../types/event.js";

class MemoryUI implements IModule {
  event_transceiver: TypedEventTransceiver;
  id: string;

  panel?: HTMLElement;

  getEventDeclaration(): EventDeclaration {
    return {
      provided: ["memory:read", "memory:write"],
      required: ["gui:panel_created"],
      optional: [],
    };
  }

  constructor(id: string, config: Record<string, unknown> | undefined, simulator: ISimulator) {
    // We use the simulator to emit/receive events.
    this.event_transceiver = simulator;
    this.id = id;

    console.log(`[${this.id}] Memory Initializing module.`);

    this.addListeners();
  }

  addListeners(): void {
    this.event_transceiver.on("gui:panel_created", this.onGuiPanelCreated);
  }

  onGuiPanelCreated = (panel_id: string, panel: HTMLElement): void => {
    if (this.id !== panel_id) return;
    console.log(`[${this.id}] obtained GUI panel`);

    this.panel = panel;

    this.panel.style.backgroundColor = "lightblue";
  };
}

export default MemoryUI;
