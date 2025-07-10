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

type Screen2DConfig = {
  multiplexer?: string;
  width: number;
  height: number;
};

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
  image: ImageData;

  language!: string;

  updateQueue: UpdateQueue;

  getModuleDeclaration(): ModuleDeclaration {
    const eventAsMultiplexedInput = (event: EventBaseName) =>
      this.config.multiplexer ? joinEventName(event, this.id) : event;
    const eventAsMultiplexedOutput = (event: EventBaseName) =>
      this.config.multiplexer ? joinEventName(event, this.config.multiplexer) : event;

    return {
      events: {
        provided: [
          eventAsMultiplexedOutput("memory:write:result"),
          eventAsMultiplexedOutput("memory:read:result"),
        ],
        required: {
          "signal:reset": this.onReset,
          [eventAsMultiplexedInput("memory:write")]: this.onMemoryWrite,
          "gui:panel_created": this.onGuiPanelCreated,
        },
        optional: {
          "ui:memory:clear": this.onReset,
        },
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

    this.image = new ImageData(this.config.width, this.config.height);
    this.updateQueue = new UpdateQueue(this.refreshUI.bind(this));

    console.log(`[${this.id}] Module initialized.`);
  }

  onReset = (): void => {
    this.image = new ImageData(this.config.width, this.config.height);
    this.updateQueue.queueUpdate();
  };

  onMemoryWrite = (address: number, data: number): void => {
    if (address < 0 || address >= this.config.height * this.config.width) return;

    this.image.data[address * 4] = data;
    this.image.data[address * 4 + 1] = data;
    this.image.data[address * 4 + 2] = data;
    this.image.data[address * 4 + 3] = 255;

    this.updateQueue.queueUpdate();

    const event = this.config.multiplexer
      ? joinEventName("memory:write:result", this.config.multiplexer)
      : "memory:write:result";
    this.event_transceiver.emit(event, address, data);
  };
  onMemoryRead = (address: number): void => {
    const event = this.config.multiplexer
      ? joinEventName("memory:read:result", this.config.multiplexer)
      : "memory:read:result";
    this.event_transceiver.emit(event, address, this.image.data[address * 4]);
  };

  onGuiPanelCreated = (panel_id: string, panel: HTMLElement, language: string): void => {
    if (panel_id !== this.id) return;

    panel.classList.add("screen2d-ui");

    const canvas = element("canvas", {
      width: this.config.width,
      height: this.config.height,
    });

    panel.appendChild(element("div", { className: "canvas-container" }, canvas));

    this.canvasContext = canvas.getContext("2d") ?? undefined;
    this.image = new ImageData(this.config.width, this.config.height);
    this.updateQueue.queueUpdate();
  };

  refreshUI(): void {
    if (!this.canvasContext) return;

    this.canvasContext.putImageData(this.image, 0, 0);
  }
}

export default ScreenUI;
