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
  DockviewComponent,
  type GroupPanelPartInitParameters,
  type IContentRenderer,
  Orientation,
  themeDark,
  themeLight,
} from "/lib/dockview-core.esm.min.js";

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
  rows: number; // Number of rows in the grid.
  columns: number; // Number of columns in the grid.
};

/**
 * Parse CSS Grid position and span.
 * Example: 1 / span 2 -> [1, 2]
 *        : 1          -> [1, undefined]
 * @param position The CSS Grid format string
 * @returns [position, span]
 */
function parsePosition(raw: string | number): [number, number | undefined] {
  if (typeof raw === "number") {
    // If the raw input is a number, it's just a position without span.
    return [raw, undefined];
  }

  const split = raw.split("/");
  const pos = Number(split[0].trim());
  const span = split[1] ? Number(split[1].trim().replace("span", "")) : undefined;
  return [pos, span];
}

class Panel implements IContentRenderer {
  private readonly _element: HTMLElement;

  get element(): HTMLElement {
    return this._element;
  }

  constructor() {
    this._element = document.createElement("div");
  }

  init(parameters: GroupPanelPartInitParameters): void {
    console.log(`[gui] Panel initialized with parameters:`, parameters);
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
        rows: {
          type: "number",
          required: false,
          default: 20,
        },
        columns: {
          type: "number",
          required: false,
          default: 10,
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
        return new Panel();
      },
    });
    console.log((this.gridElement.children[0] as HTMLDivElement).style);

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
    this.createGuiPanels();
  };
  // Dockview needs a bit of time to initialize, so we use a flag to ensure we
  // only create the GUI panels after both the system and Dockview are ready.
  isDoneInitializing = false;

  requiredPositions: Record<string, { x: number; y: number }> = {};
  createGuiPanels = (): void => {
    this.et.emit("ui:language", this.language);
    // Now that the system is loaded, we can start rendering the GUI, and (most importantly) tell
    // the other modules that the GUI is ready, and what their panel ids are.
    console.log(`[${this.id}] Creating GUI panels`);

    const [screenWidth, screenHeight] = [window.innerWidth, window.innerHeight];
    const rowHeight = screenHeight / this.config.rows;
    const colWidth = screenWidth / this.config.columns;

    console.log(`[${this.id}] Screen size: ${screenWidth}x${screenHeight}`);
    console.log(`[${this.id}] Rows: ${this.config.rows}, Columns: ${this.config.columns}`);
    console.log(`[${this.id}] Row height: ${rowHeight}, Column width: ${colWidth}`);

    for (const panel of this.config.panels) {
      console.log(`[${this.id}] Creating panel ${panel.id}`);
      let [colPos, colSpan] = parsePosition(panel.column);
      let [rowPos, rowSpan] = parsePosition(panel.row);
      colSpan ??= 1; // Default to 1 if not specified
      rowSpan ??= 1; // Default to 1 if not specified

      // Handle negative positions
      if (colPos < 0) colPos = this.config.columns + colPos;
      if (rowPos < 0) rowPos = this.config.rows + rowPos;
      rowSpan = Math.abs(rowSpan); // Ensure span is positive (we have already handled negative positions)

      console.log(
        `[${this.id}] Creating panel ${panel.id} at column ${colPos} (span ${colSpan}) and row ${rowPos} (span ${rowSpan})`,
      );
      console.log(
        `[${this.id}] Panel position: (${colPos * colWidth}, ${rowPos * rowHeight}), size: (${colSpan * colWidth}, ${rowSpan * rowHeight})`,
      );
      const dvPanel = this.dockViewApi.addPanel({
        id: panel.id,
        component: "default",
        title: panel.langName[this.language] || panel.name || panel.id,
        floating: {
          width: colSpan * colWidth,
          height: rowSpan * rowHeight,
          position: { left: colPos * colWidth, top: rowPos * rowHeight },
        },
      });
      const requiredX = colPos * colWidth;
      const requiredY = rowPos * rowHeight;
      if (requiredX !== 0 || requiredY !== 0) {
        this.requiredPositions[panel.id] = {
          x: colPos * colWidth,
          y: rowPos * rowHeight,
        };
      }

      console.log(`[${this.id}] Panel created:`, dvPanel);

      // debugger;
      const panel_content = dvPanel.view.content.element;
      this.et.emit("gui:panel_created", panel.id, panel_content, this.language);
    }
    // setTimeout(this.moveGuiPanels, 10);
    this.ensureCorrectPanelPositions();
  };
  ensureCorrectPanelPositions = (): void => {
    const component = (this.dockViewApi as unknown as { component: DockviewComponent }).component;

    for (const floatingPanel of component.floatingGroups) {
      const panels = floatingPanel.group.panels;
      if (panels.length === 0) continue; // No panels in this group
      if (panels.length > 1) {
        console.warn(`[${this.id}] Floating group has more than one panel, this is not expected.`);
      }
      // We create one-panel floating groups, so we can just take the first one.
      const panelId = panels[0].id;
      if (!(panelId in this.requiredPositions)) continue;

      // console.log(`[${this.id}] Checking panel ${panelId} position`);
      const requiredPosition = this.requiredPositions[panelId];
      const panelX = floatingPanel.overlay.element.style.left;
      const panelY = floatingPanel.overlay.element.style.top;
      if (panelX === `${requiredPosition.x}px` || panelY === `${requiredPosition.y}px`) {
        delete this.requiredPositions[panelId];
        continue;
      }
      // console.warn(
      //   `[${this.id}] Panel ${panelId} position is incorrect, moving it to (${requiredPosition.x}, ${requiredPosition.y})`,
      // );
      floatingPanel.position({
        left: requiredPosition.x,
        top: requiredPosition.y,
      });
    }
    if (Object.keys(this.requiredPositions).length > 0) {
      setTimeout(this.ensureCorrectPanelPositions, 0);
    }
  };
  moveGuiPanels = (): void => {
    const [screenWidth, screenHeight] = [window.innerWidth, window.innerHeight];
    const rowHeight = screenHeight / this.config.rows;
    const colWidth = screenWidth / this.config.columns;

    console.log(`[${this.id}] Screen size: ${screenWidth}x${screenHeight}`);
    console.log(`[${this.id}] Rows: ${this.config.rows}, Columns: ${this.config.columns}`);
    console.log(`[${this.id}] Row height: ${rowHeight}, Column width: ${colWidth}`);

    for (const panel of this.config.panels) {
      console.log(`[${this.id}] Moving panel ${panel.id}`);
      let [colPos, colSpan] = parsePosition(panel.column);
      let [rowPos, rowSpan] = parsePosition(panel.row);
      colSpan ??= 1; // Default to 1 if not specified
      rowSpan ??= 1; // Default to 1 if not specified

      // Handle negative positions
      if (colPos < 0) colPos = this.config.columns + colPos;
      if (rowPos < 0) rowPos = this.config.rows + rowPos;
      rowSpan = Math.abs(rowSpan); // Ensure span is positive (we have already handled negative positions)

      console.log(
        `[${this.id}] Moving panel ${panel.id} at column ${colPos} (span ${colSpan}) and row ${rowPos} (span ${rowSpan})`,
      );
      console.log(
        `[${this.id}] Panel position: (${colPos * colWidth}, ${rowPos * rowHeight}), size: (${colSpan * colWidth}, ${rowSpan * rowHeight})`,
      );
      const dvPanel = this.dockViewApi.getPanel(panel.id)!;
      this.dockViewApi.addFloatingGroup(dvPanel, {
        width: colSpan * colWidth,
        height: rowSpan * rowHeight,
        position: { left: colPos * colWidth, top: rowPos * rowHeight },
      });

      console.log(`[${this.id}] Panel moved:`, dvPanel);
    }
  };
}

export default Gui;
