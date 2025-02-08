import type { IModule } from "../../types/module.js";
import type { ISimulator } from "../../types/simulator.js";
import type { EventDeclaration, TypedEventTransceiver } from "../../types/event.js";
import { element } from "../../general/html.js";
import { timeAgo } from "../../general/dates.js";
import { verify } from "../../general/config.js";

type GuiPanelConfig = {
  id: string; // Id of the module being loaded.
  column: string | number;
  row: string | number;
};
type GuiConfig = {
  panels: GuiPanelConfig[];
  language?: string;
};

class Gui implements IModule {
  event_transceiver: TypedEventTransceiver;
  config: GuiConfig;
  language: string;
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
        language: { type: "string", required: false },
      },
      `[${this.id}] configuration error: `,
    );

    // Set the language to be used in the GUI.
    if (this.config.language) {
      // If the language is provided in the configuration, use it.
      this.language = this.config.language;
    } else {
      // Otherwise, use the browser's language.
      this.language = navigator.language;
      if (this.language.length > 2) this.language = this.language.slice(0, 2);
    }

    // Get the root element where the GUI will be rendered.
    const root_element = document.getElementById("root");
    if (root_element == null) throw new Error(`[${this.id}] Root element found`);
    root_element.classList.add("gui-root");
    this.root_element = root_element;

    this.createDeploymentInfoElement();

    console.log(`[${this.id}] Module initialized with language ${this.language}.`);
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
      this.event_transceiver.emit("gui:panel_created", panel.id, panel_element, this.language);
    }
  };
}

export default Gui;
