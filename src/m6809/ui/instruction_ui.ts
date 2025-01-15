import type { IModule } from "../../types/module.js";
import type { ISimulator } from "../../types/simulator.js";
import type { EventDeclaration, TypedEventTransceiver } from "../../types/event.js";
import { element } from "../../utils.js";

// biome-ignore lint/complexity/noBannedTypes: <explanation>
type InstructionUIConfig = {};

function validateMemoryUIConfig(config: Record<string, unknown>): InstructionUIConfig {
  return config as InstructionUIConfig;
}

class InstructionUI implements IModule {
  event_transceiver: TypedEventTransceiver;
  id: string;

  config: InstructionUIConfig;

  panel?: HTMLElement;
  memoryTable?: HTMLTableElement;

  lastMemoryRead?: number;
  lastMemoryWrite?: number;

  getEventDeclaration(): EventDeclaration {
    return {
      provided: ["ui:memory:read", "ui:memory:write"],
      required: {
        "gui:panel_created": this.onGuiPanelCreated,
      },
      optional: {},
    };
  }

  constructor(
    id: string,
    config: Record<string, unknown> | undefined,
    eventTransceiver: TypedEventTransceiver,
  ) {
    // We use the simulator to emit/receive events.
    this.event_transceiver = eventTransceiver;
    this.id = id;

    if (!config) throw new Error(`[${this.id}] No configuration provided`);
    this.config = validateMemoryUIConfig(config);

    console.log(`[${this.id}] Memory Initializing module.`);
  }

  onGuiPanelCreated = (panel_id: string, panel: HTMLElement): void => {
    if (this.id !== panel_id) return;
    console.log(`[${this.id}] obtained GUI panel`);

    this.panel = panel;
    this.panel.classList.add("instruction-ui");

    this.populatePanel();
  };

  formatMemoryData(data: number): string {
    return data.toString(16).padStart(2, "0");
  }

  populatePanel(): void {
    if (!this.panel) return;
  }
}

export default InstructionUI;
