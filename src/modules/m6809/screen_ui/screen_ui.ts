import { verify } from "../../../utils/config.js";
import { joinEventName } from "../../../utils/event.js";
import { element } from "../../../utils/html.js";
import { createLanguageStrings } from "../../../utils/lang.js";
import { UpdateQueue } from "../../../utils/updatequeue.js";
import type {
  EventBaseName,
  EventDeclaration,
  TypedEventTransceiver,
} from "../../../types/event.js";
import type { IModule, ModuleDeclaration } from "../../../types/module.js";

type ScreenConfig = {
  multiplexer?: string;
};

const ScreenUIStrings = createLanguageStrings({
  en: {},
  es: {},
});

class ScreenUI implements IModule {
  id: string;
  event_transceiver: TypedEventTransceiver;
  config: ScreenConfig;

  panel?: HTMLElement;

  textElement?: HTMLElement;

  language!: string;
  localeStrings!: typeof ScreenUIStrings.en;

  updateQueue: UpdateQueue<number>;

  getModuleDeclaration(): ModuleDeclaration {
    const eventAsMultiplexedInput = (event: EventBaseName) =>
      this.config.multiplexer ? joinEventName(event, this.id) : event;
    const eventAsMultiplexedOutput = (event: EventBaseName) =>
      this.config.multiplexer ? joinEventName(event, this.config.multiplexer) : event;

    return {
      events: {
        provided: [eventAsMultiplexedOutput("memory:write:result")],
        required: {
          "signal:reset": this.onReset,
          [eventAsMultiplexedInput("memory:write")]: this.onMemoryWrite,
          "gui:panel_created": this.onGuiPanelCreated,
        },
        optional: {},
      },
    };
  }

  constructor(
    id: string,
    config: Record<string, unknown>,
    eventTransceiver: TypedEventTransceiver,
  ) {
    this.id = id;
    this.event_transceiver = eventTransceiver;

    this.config = verify(config, {
      multiplexer: {
        type: "string",
        required: false,
      },
    });

    this.updateQueue = new UpdateQueue(this.refreshUI.bind(this));

    console.log(`[${this.id}] Module initialized.`);
  }

  setLanguage(language: string): void {
    this.language = language;
    this.localeStrings = ScreenUIStrings[this.language] || ScreenUIStrings.en;
  }

  onReset = (): void => {
    this.updateQueue.queueUpdate(-1);
  };

  onMemoryWrite = (address: number, data: number): void => {
    this.updateQueue.queueUpdate(data);

    const event = this.config.multiplexer
      ? joinEventName("memory:write:result", this.config.multiplexer)
      : "memory:write:result";
    this.event_transceiver.emit(event, address, data);
  };

  onGuiPanelCreated = (panel_id: string, panel: HTMLElement, language: string): void => {
    if (panel_id !== this.id) return;
    this.panel = panel;

    this.panel.classList.add("screen-ui");
    this.setLanguage(language);

    this.textElement = element("pre", { textContent: "" });

    this.panel.appendChild(this.textElement);
  };

  refreshUI(charCodes: number[]): void {
    if (!this.textElement || !this.panel) return;

    // Auto scroll to bottom if already on bottom. I haven't been able to achieve
    // this with CSS, so I'm doing it here.
    const atBottom = this.panel.scrollHeight - this.panel.clientHeight <= this.panel.scrollTop + 1;

    let text = this.textElement.textContent ?? "";
    for (const charCode of charCodes) {
      if (charCode === -1) {
        text = "";
      } else {
        text += String.fromCharCode(charCode);
      }
    }
    this.textElement.textContent = text;

    if (atBottom) this.panel.scrollTop = this.panel.scrollHeight - this.panel.clientHeight;
  }
}

export default ScreenUI;
