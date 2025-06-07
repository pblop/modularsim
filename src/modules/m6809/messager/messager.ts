import { verify } from "../../../utils/config.js";
import type { TypedEventTransceiver } from "../../../types/event.js";
import type { IModule, ModuleDeclaration } from "../../../types/module.js";

type MessagerConfig = {};

class Messager implements IModule {
  et: TypedEventTransceiver;
  id: string;

  config: MessagerConfig;

  getModuleDeclaration(): ModuleDeclaration {
    return {
      events: {
        provided: ["ui:message:status"],
        required: {},
        optional: {
          "dbg:program:loaded": this.onProgramLoaded,
        },
      },
    };
  }

  onProgramLoaded = (name: string): void => {
    this.et.emit("ui:message:status", `Program loaded: ${name}.`);
  };

  constructor(
    id: string,
    config: Record<string, unknown> | undefined,
    eventTransceiver: TypedEventTransceiver,
  ) {
    // We use the simulator to emit/receive events.
    this.et = eventTransceiver;
    this.id = id;

    this.config = verify<MessagerConfig>(config, {}, this.id);

    console.log(`[${this.id}] Initializing messager module.`);
  }
}

export default Messager;
