import { verify } from "../../../utils/config.js";
import { timeAgo } from "../../../utils/dates.js";
import { element } from "../../../utils/html.js";
import type { EventDeclaration, TypedEventTransceiver } from "../../../types/event.js";
import type { IModule, ModuleDeclaration } from "../../../types/module.js";
import type { ISimulator } from "../../../types/simulator.js";
import { VirtualListElement } from "../../../utils/VirtualListElement.js";
import { GridStack } from "https://cdn.jsdelivr.net/npm/gridstack@12.2.1/+esm";

type GuiMovablePanelConfig = {
  id: string; // Id of the module being loaded.
  column: string;
  row: string;
  name?: string; // Name of the panel, used for the title.
  // Language-specific name of the panel, has higher priority than `name`.
  langName: Record<string, string>;
};
type GuiMovableConfig = {
  panels: GuiMovablePanelConfig[];
  language?: string;
  root_selector: string;
  show_titles: boolean;
};

function parseRowSpan(rowSpan: string): [number, number] {
  const match = rowSpan.match(/(\d+)(?:\s*\/\s*span\s*(\d+))?/);
  if (!match) {
    throw new Error(`Invalid row/column format: ${rowSpan}`);
  } else {
    const row = Number.parseInt(match[1], 10);
    let col = 1; // Default span is 1 if not specified
    if (match[2]) {
      col = Number.parseInt(match[2], 10);
    }

    return [row, col];
  }
}

class GuiMovable implements IModule {
  et: TypedEventTransceiver;
  config: GuiMovableConfig;
  language: string;
  id: string;

  rootElement: HTMLElement;
  grid: GridStack;

  getModuleDeclaration(): ModuleDeclaration {
    return {
      events: {
        provided: ["gui:panel_created"],
        required: { "system:load_finish": this.onSystemLoadFinish },
        optional: {},
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

    this.createDeploymentInfoElement();

    GridStack.renderCB = (el, w) => {
      el.innerHTML = w.content!;
    };

    this.grid = GridStack.init(
      {
        animate: false,
        cellHeight: 70,
        margin: 0,
        layout: "none",
      },
      this.rootElement,
    );

    this.grid.on("added", (event, items) => {
      // When a panel is added, we notify its corresponding module that the
      // panel has been created.
      for (const item of items) {
        item.el!.classList.add("gui-panel");
        const guiPanel = item.el!.querySelector("[data-panel]")!;
        const panelId = guiPanel.getAttribute("data-panel")!;
        // Notify other modules that the panel has been created
        this.et.emit(
          "gui:panel_created",
          panelId,
          guiPanel.querySelector(".gui-panel-content")!,
          this.language,
        );
      }
    });

    VirtualListElement.define();

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
        this.rootElement.appendChild(deployment_info_element);
      })
      .catch(() => {});
  }

  onSystemLoadFinish = (): void => {
    // Now that the system is loaded, we can start rendering the GUI, and (most importantly) tell
    // the other modules that the GUI is ready, and what their panel ids are.
    console.log(`[${this.id}] Creating GUI panels`);
    for (const panel of this.config.panels) {
      console.log(`[${this.id}] Creating panel ${panel.id}`);

      let header = "";

      // If the config says to show titles, we create a header for the panel,
      // and use the name from the config or the id of the panel, if no name is
      // provided.
      if (this.config.show_titles) {
        const lang_name = panel.langName[this.language] || panel.name || panel.id;
        header = `
          <div class="gui-panel-header">
            <span class="gui-panel-title">${lang_name}</span>
          </div>
        `;
      }
      // This panel content div is the main area where the module will render
      // its content. This is passed to the module.
      const panelContent = `
          <div class="gui-panel-content" id="panel_content_${panel.id}"></div>
          `;

      const template = `
        <div id="panel_${panel.id}" data-panel="${panel.id}">
          ${header}
          ${panelContent}
        </div>
      `;

      const rowSpan = parseRowSpan(panel.row);
      const colSpan = parseRowSpan(panel.column);
      console.log(
        `Parsed panel ${panel.id} rowSpan: ${rowSpan}, colSpan: ${colSpan} from row: ${panel.row}, column: ${panel.column}`,
      );

      this.grid.addWidget({
        content: template,
        w: colSpan[1],
        h: rowSpan[1],
        x: colSpan[0] - 1, // GridStack uses 0-based indexing, CSS uses 1-based indexing.
        y: rowSpan[0] - 1,
      });
      console.log(`[${this.id}] Panel ${panel.id} created `);
      // this.rootElement.appendChild(panel_element);
      // break;
    }
  };
}

export default GuiMovable;
