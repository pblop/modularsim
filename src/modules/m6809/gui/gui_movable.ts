import { verify } from "../../../utils/config.js";
import { timeAgo } from "../../../utils/dates.js";
import { element } from "../../../utils/html.js";
import type { EventDeclaration, TypedEventTransceiver } from "../../../types/event.js";
import type { IModule, ModuleDeclaration } from "../../../types/module.js";
import type { ISimulator } from "../../../types/simulator.js";
import { VirtualListElement } from "../../../utils/VirtualListElement.js";
import { UpdateQueue } from "../../../utils/updatequeue.js";
import {
  createDockview,
  type DockviewApi,
  type GroupPanelPartInitParameters,
  type IContentRenderer,
  themeDark,
  themeLight,
} from "https://unpkg.com/dockview-core@4.4.0/dist/esm/index.js";

type GuiPanelConfig = {
  id: string; // Id of the module being loaded.
  column: string | number;
  row: string | number;
  name?: string; // Name of the panel, used for the title.
  // Language-specific name of the panel, has higher priority than `name`.
  langName: Record<string, string>;
};
type GuiConfig = {
  panels: GuiPanelConfig[];
  language?: string;
  root_selector: string;
  show_titles: boolean;
  show_status: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "no";
};

class Panel implements IContentRenderer {
  private readonly _element: HTMLElement;

  get element(): HTMLElement {
    return this._element;
  }

  constructor() {
    this._element = document.createElement("div");
  }

  init(parameters: GroupPanelPartInitParameters): void {
    // console.log(`[gui] Panel initialized with parameters:`, parameters);
  }
}

class Gui implements IModule {
  et: TypedEventTransceiver;
  config: GuiConfig;
  language: string;
  id: string;

  rootElement: HTMLElement;
  gridElement: HTMLElement;
  dockViewApi: DockviewApi;
  statusElement?: HTMLElement;
  statusMessage?: string;

  statusUpdateQueue?: UpdateQueue;

  getModuleDeclaration(): ModuleDeclaration {
    return {
      events: {
        provided: ["gui:panel_created", "ui:language"],
        required: { "system:load_finish": this.onSystemLoadFinish },
        optional: {
          "ui:message:status": this.onStatusMessage,
        },
      },
    };
  }

  constructor(
    id: string,
    config: Record<string, unknown> | undefined,
    eventTransceiver: TypedEventTransceiver,
  ) {
    // We use the simulator to emit/receive events.
    this.et = eventTransceiver;
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
              name: { type: "string", required: false },
              langName: {
                type: "object",
                required: false,
                keyPattern: /^[\w\-]+$/,
                schema: { type: "string" },
                default: {},
              },
              id: { type: "string", required: true },
              column: { type: "string" },
              row: { type: "string" },
            },
          },
        },
        language: { type: "string", required: false },
        root_selector: {
          type: "string",
          required: false,
          default: "#root",
        },
        show_titles: {
          type: "boolean",
          required: false,
          default: true,
        },
        show_status: {
          type: "string",
          required: false,
          default: "bottom-left",
          enum: ["top-left", "top-right", "bottom-left", "bottom-right", "no"],
        },
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
    const root_element = document.querySelector(this.config.root_selector) as HTMLElement;
    if (root_element == null) throw new Error(`[${this.id}] Root element found`);
    root_element.classList.add("gui-root");
    this.rootElement = root_element;

    const gridElement = element("div", {
      className: "gui-grid",
    });
    this.rootElement.appendChild(gridElement);
    this.gridElement = gridElement;

    this.dockViewApi = createDockview(gridElement, {
      // theme: {
      //   name: "mytheme",
      //   className: "",
      // },
      theme: themeDark,
      createComponent: (options) => {
        // console.log(`[gui] Creating component for panel:`, options);
        return new Panel();
      },
    });

    this.createDeploymentInfoElement();
    if (this.config.show_status !== "no") {
      this.statusElement = this.createStatusElement();
      this.statusMessage = "";
      this.statusUpdateQueue = new UpdateQueue(this._refreshStatusElement.bind(this));
    }
    VirtualListElement.define();

    console.log(`[${this.id}] Module initialized with language ${this.language}.`);
  }

  createDeploymentInfoElement() {
    const position = this.config.show_status === "bottom-left" ? "bottom-right" : "bottom-left";
    fetch("deployment-info.json")
      .then((r) => r.json())
      .then((info) => {
        const date = new Date(info.date);
        const deployment_info_element = element("div", {
          className: `gui-floating ${position}`,
          innerText: `${info.commit.slice(0, 7)} (${timeAgo(date)})`,
          title: `${info.message}\n\n${info.body ?? ""}`.trimEnd(),
        });
        this.gridElement.appendChild(deployment_info_element);
      })
      .catch(() => {});
  }
  createStatusElement() {
    const status_element = element("div", {
      className: `gui-floating ${this.config.show_status}`,
    });
    this.gridElement.appendChild(status_element);
    return status_element;
  }

  onStatusMessage = (message: string): void => {
    if (!this.statusElement) return;
    this.statusMessage = message;
    console.log(`[${this.id}] Status message: ${message}`);
    this.statusUpdateQueue!.queueUpdate();
  };
  _refreshStatusElement = (): void => {
    // If the message is empty, remove the status element.
    if (this.statusMessage === "") {
      this.statusElement!.innerText = "";
      return;
    }

    // Otherwise, set the message.
    this.statusElement!.innerText = this.statusMessage!;
  };

  onSystemLoadFinish = (): void => {
    this.et.emit("ui:language", this.language);
    // Now that the system is loaded, we can start rendering the GUI, and (most importantly) tell
    // the other modules that the GUI is ready, and what their panel ids are.
    console.log(`[${this.id}] Creating GUI panels`);
    for (const panel of this.config.panels) {
      console.log(`[${this.id}] Creating panel ${panel.id}`);
      const dvPanel = this.dockViewApi.addPanel({
        id: panel.id,
        component: "default",
        title: panel.langName[this.language] || panel.name || panel.id,
      });
      this.dockViewApi.addFloatingGroup(dvPanel, {
        // x: panel.column!,
        // y: panel.row!,
      });
      const panel_content = dvPanel.view.content.element;
      console.log(`[${this.id}] Panel ${panel.id} created with content element:`, panel_content);

      const children = [];

      // If the config says to show titles, we create a header for the panel,
      // and use the name from the config or the id of the panel, if no name is
      // provided.

      // This panel content div is the main area where the module will render
      // its content. This is passed to the module.
      // const panel_content = element("div", {
      //   className: "gui-panel-content",
      //   id: `panel_content_${panel.id}`,
      // });
      // children.push(panel_content);

      // const panel_element = element(
      //   "div",
      //   {
      //     id: `panel_${panel.id}`,
      //     className: "gui-panel",
      //     style: {
      //       gridColumn: `${panel.column}`,
      //       gridRow: `${panel.row}`,
      //     },
      //   },
      //   ...children,
      // );
      // this.gridElement.appendChild(panel_element);

      // Notify other modules that the panel has been created
      this.et.emit("gui:panel_created", panel.id, panel_content, this.language);
    }
  };
}

export default Gui;
