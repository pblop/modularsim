import type { IModule } from "../../types/module";
import type { ISimulator } from "../../types/simulator";
import type { TypedEventTransceiver, EventDeclaration } from "../../types/event";
import { element } from "../../utils.js";

type ClockUIConfig = {
  frequency: number;
};

function verifyClockUIConfig(config: Record<string, unknown>): ClockUIConfig {
  if (typeof config.frequency !== "number") throw new Error("[ClockUI] frequency must be a number");
  return config as ClockUIConfig;
}

type ClockUIState = {
  machineState: "running" | "paused" | "stopped";
  lastCycleTime: number;
};

class ClockUI implements IModule {
  id: string;
  event_transceiver: TypedEventTransceiver;

  config: ClockUIConfig;

  panel?: HTMLElement;
  state: ClockUIState;

  getEventDeclaration(): EventDeclaration {
    return {
      provided: [
        "signal:reset",
        "ui:clock:step_cycle",
        "ui:clock:pause",
        "ui:clock:start",
        "ui:clock:step_instruction",
      ],
      required: {
        "clock:cycle_start": this.onCycleStart,
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

    this.config = verifyClockUIConfig(config);

    this.state = {
      machineState: "stopped",
      lastCycleTime: 0,
    };

    console.log(`[${this.id}] Module initialized.`);
  }

  onCycleStart = (): void => {
    console.log(`[${this.id}] Clock cycle started`);
    this.setState({ lastCycleTime: performance.now() });
  };

  setState(state: Partial<ClockUIState>): void {
    this.state = { ...this.state, ...state };
    this.draw(state);
  }

  draw(changes?: Partial<ClockUIState>): void {
    if (this.panel == null) return;

    if (!changes || "machineState" in changes) {
      const main = this.panel.querySelector(".clock-main");
      if (main == null) return; // This should never happen.
      main.innerHTML = "";

      if (this.state.machineState === "running") {
        main.appendChild(
          element("button", {
            properties: {
              textContent: "Pause",
              onclick: () => {
                this.event_transceiver.emit("ui:clock:pause");
                this.setState({ machineState: "paused" });
              },
            },
          }),
        );
      }

      if (this.state.machineState === "paused") {
        main.appendChild(
          element("button", {
            properties: {
              textContent: "Continue",
              onclick: () => {
                this.event_transceiver.emit("ui:clock:start");
                this.setState({ machineState: "running" });
              },
            },
          }),
        );
        main.appendChild(
          element("button", {
            properties: {
              textContent: "Step (cycle)",
              onclick: () => {
                this.event_transceiver.emit("ui:clock:step_cycle");
              },
            },
          }),
        );
      }

      main.appendChild(
        element("button", {
          properties: {
            textContent: "Reset",
            onclick: () => {
              this.event_transceiver.emit("signal:reset");
              this.setState({ machineState: "paused" });
            },
          },
        }),
      );
    }

    if (changes && "lastCycleTime" in changes) {
      const marker = this.panel.querySelector(".clock-marker") as HTMLElement;
      if (marker == null) return; // This should never happen.
      if (!marker.classList.contains(".clock-animation")) marker.classList.add("clock-animation");

      marker.style.animation = "none";
      marker.offsetHeight; // Trigger reflow
      marker.style.animation = "";
    }
  }

  onGuiPanelCreated = (panel_id: string, panel: HTMLElement): void => {
    if (panel_id !== this.id) return;
    this.panel = panel;

    this.panel.classList.add("clock-ui");
    this.panel.style.setProperty("--clock-frequency", `${this.config.frequency}`);

    this.panel.appendChild(element("div", { properties: { className: "clock-main" } }));
    this.panel.appendChild(element("div", { properties: { className: "clock-marker" } }));

    this.draw();
  };
}

export default ClockUI;
