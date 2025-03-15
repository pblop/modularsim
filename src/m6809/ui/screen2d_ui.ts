import type { IModule, ModuleDeclaration } from "../../types/module";
import type { TypedEventTransceiver, EventDeclaration, EventBaseName } from "../../types/event";
import { element } from "../../general/html.js";
import { verify } from "../../general/config.js";
import { createLanguageStrings } from "../../general/lang.js";
import { joinEventName } from "../../general/event.js";
import { UpdateQueue } from "../../general/updatequeue.js";

type Screen2DConfig = {
  multiplexer?: string;
  width: number;
  height: number;
};

const Screen2DUIStrings = createLanguageStrings({
  en: {
    title: "2D Screen",
  },
  es: {
    title: "Pantalla 2D",
  },
});

const findLastIndex = <T>(
  arr: T[],
  predicate: (value: T, index: number, arr: T[]) => boolean,
): number => {
  let index = arr.length;
  while (index-- > 0) {
    const value = arr[index];
    const result = predicate(value, index, arr);
    if (result) return index;
  }
  return -1;
};

type PixelUpdateQueueItem = { x: number; y: number; grayscale: number };
class ScreenUI implements IModule {
  id: string;
  event_transceiver: TypedEventTransceiver;
  config: Screen2DConfig;

  canvasContext?: CanvasRenderingContext2D;

  language!: string;
  localeStrings!: typeof Screen2DUIStrings.en;

  updateQueue: UpdateQueue<PixelUpdateQueueItem>;

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
      width: {
        type: "number",
        required: true,
      },
      height: {
        type: "number",
        required: true,
      },
    });

    this.updateQueue = new UpdateQueue(this.refreshUI.bind(this));

    console.log(`[${this.id}] Module initialized.`);
  }

  setLanguage(language: string): void {
    this.language = language;
    this.localeStrings = Screen2DUIStrings[this.language] || Screen2DUIStrings.en;
  }

  onReset = (): void => {
    this.updateQueue.queueUpdate({ x: -1, y: -1, grayscale: 0 });
  };

  onMemoryWrite = (address: number, data: number): void => {
    const x = address % this.config.width;
    const y = Math.floor(address / this.config.width);
    const set = data !== 0;
    this.updateQueue.queueUpdate({ x, y, grayscale: data });

    const event = this.config.multiplexer
      ? joinEventName("memory:write:result", this.config.multiplexer)
      : "memory:write:result";
    this.event_transceiver.emit(event, address, data);
  };

  onGuiPanelCreated = (panel_id: string, panel: HTMLElement, language: string): void => {
    if (panel_id !== this.id) return;

    panel.classList.add("screen2d-ui");
    this.setLanguage(language);

    panel.appendChild(element("h2", { textContent: this.localeStrings.title }));

    const canvas = element("canvas", {
      width: this.config.width,
      height: this.config.height,
    });

    panel.appendChild(element("div", { className: "canvas-container" }, canvas));

    this.canvasContext = canvas.getContext("2d") ?? undefined;
    this.clearScreen();
  };

  clearScreen(): void {
    if (!this.canvasContext) return;

    this.canvasContext.fillStyle = "black";
    this.canvasContext.fillRect(0, 0, this.config.width, this.config.height);
  }

  refreshUI(pixels: PixelUpdateQueueItem[]): void {
    if (!this.canvasContext) return;

    // If there's a clear command, clear the screen and ignore all pixels before it.
    const lastClear = findLastIndex(pixels, (pixel) => pixel.x === -1 && pixel.y === -1);
    if (lastClear !== -1) {
      pixels = pixels.slice(lastClear + 1);
      this.clearScreen();
    }

    const imageData = this.canvasContext.getImageData(0, 0, this.config.width, this.config.height);
    for (const pixel of pixels) {
      const index = (pixel.y * this.config.width + pixel.x) * 4;
      imageData.data[index] = pixel.grayscale;
      imageData.data[index + 1] = pixel.grayscale;
      imageData.data[index + 2] = pixel.grayscale;
      imageData.data[index + 3] = 255;
    }

    this.canvasContext.putImageData(imageData, 0, 0);
  }
}

export default ScreenUI;
