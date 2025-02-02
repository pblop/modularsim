import type { IModule } from "../../types/module";
import type { ISimulator } from "../../types/simulator";
import type { TypedEventTransceiver, EventDeclaration } from "../../types/event";
import { element } from "../../general/html.js";

type StopConfig = {
  address: number;
};

function validateScreenConfig(config: Record<string, unknown>): StopConfig {
  if (typeof config.address !== "number") throw new Error("[Stop] address must be a number");

  return config as StopConfig;
}

class Stop implements IModule {
  id: string;
  event_transceiver: TypedEventTransceiver;
  config: StopConfig;

  getEventDeclaration(): EventDeclaration {
    return {
      provided: ["ui:clock:pause"],
      required: {
        "memory:write": this.onMemoryWrite,
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

    this.config = validateScreenConfig(config);

    console.log(`[${this.id}] Module initialized.`);
  }

  onMemoryWrite = (address: number, data: number): void => {
    if (address !== this.config.address) return;

    this.event_transceiver.emit("ui:clock:pause");
  };
}

export default Stop;
