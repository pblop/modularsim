import type { IModule, ModuleDeclaration } from "../../types/module";
import type { TypedEventTransceiver, EventDeclaration } from "../../types/event";
import { verify } from "../../general/config.js";

type StopConfig = {
  address: number;
};

class Stop implements IModule {
  id: string;
  event_transceiver: TypedEventTransceiver;
  config: StopConfig;

  getModuleDeclaration(): ModuleDeclaration {
    return {
      events: {
        provided: ["ui:clock:pause"],
        required: {
          "memory:write": this.onMemoryWrite,
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
      address: {
        type: "number",
        required: true,
      },
    });

    console.log(`[${this.id}] Module initialized.`);
  }

  onMemoryWrite = (address: number, data: number): void => {
    if (address !== this.config.address) return;

    this.event_transceiver.emit("ui:clock:pause");
  };
}

export default Stop;
