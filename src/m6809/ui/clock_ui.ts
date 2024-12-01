import type { IModule } from "../../types/module";
import type { ISimulator } from "../../types/simulator";
import type { TypedEventTransceiver, EventDeclaration } from "../../types/event";

class ClockUI implements IModule {
  id: string;
  event_transceiver: TypedEventTransceiver;
  panel?: HTMLElement;

  getEventDeclaration(): EventDeclaration {
    return {
      provided: [],
      required: ["clock:cycle_start", "gui:panel_created"],
      optional: [],
    };
  }

  constructor(id: string, config: Record<string, unknown>, simulator: ISimulator) {
    this.id = id;
    this.event_transceiver = simulator;

    this.addListeners();

    console.log(`[${this.id}] Module initialized.`);
  }

  addListeners(): void {
    this.event_transceiver.on("clock:cycle_start", this.onCycleStart);
    this.event_transceiver.on("gui:panel_created", this.onGuiPanelCreated);
  }

  onCycleStart = (): void => {
    console.log(`[${this.id}] Clock cycle started`);
  };

  onGuiPanelCreated = (panel_id: string, panel: HTMLElement): void => {
    if (panel_id !== this.id) return;
    this.panel = panel;

    this.panel.classList.add("clock-ui");

    const pause_button = document.createElement("button");
    pause_button.textContent = "Pause";
    pause_button.onclick = () => {
      this.event_transceiver.emit("ui:clock:pause");
    };
    this.panel.appendChild(pause_button);

    const start_button = document.createElement("button");
    start_button.textContent = "Start";
    start_button.onclick = () => {
      this.event_transceiver.emit("ui:clock:start");
    };
    this.panel.appendChild(start_button);

    const step_cycle = document.createElement("button");
    step_cycle.textContent = "Step (cycle)";
    step_cycle.onclick = () => {
      this.event_transceiver.emit("ui:clock:step_cycle");
    };
    this.panel.appendChild(step_cycle);
  };
}

export default ClockUI;
