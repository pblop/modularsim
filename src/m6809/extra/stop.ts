import type { IModule, ModuleDeclaration } from "../../types/module";
import type { TypedEventTransceiver, EventDeclaration, EventBaseName } from "../../types/event";
import { verify } from "../../general/config.js";
import { joinEventName } from "../../general/event.js";

type StopConfig = {
  multiplexer: string;
};

class Stop implements IModule {
  id: string;
  event_transceiver: TypedEventTransceiver;
  config: StopConfig;

  getModuleDeclaration(): ModuleDeclaration {
    const eventAsMultiplexedInput = (event: EventBaseName) =>
      this.config.multiplexer ? joinEventName(event, this.id) : event;
    const eventAsMultiplexedOutput = (event: EventBaseName) =>
      this.config.multiplexer ? joinEventName(event, this.config.multiplexer) : event;

    return {
      events: {
        provided: ["ui:clock:pause", eventAsMultiplexedOutput("memory:write:result")],
        required: {
          [eventAsMultiplexedInput("memory:write")]: this.onMemoryWrite,
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

    console.log(`[${this.id}] Module initialized.`);
  }

  onMemoryWrite = (address: number, data: number): void => {
    this.event_transceiver.emit("ui:clock:pause");
    this.event_transceiver.emit(
      joinEventName("memory:write:result", this.config.multiplexer),
      address,
      data,
    );
  };
}

export default Stop;
