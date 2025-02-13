import type { IModule, ModuleDeclaration } from "../../types/module.js";
import type { EventDeclaration, TypedEventTransceiver } from "../../types/event.js";

type LoaderConfig = {
  file: string;
};

function validateLoaderConfig(config: Record<string, unknown>): LoaderConfig {
  if (typeof config.file !== "string") throw new Error("[Loader] binUrl must be a string");
  return config as LoaderConfig;
}

class Loader implements IModule {
  evt: TypedEventTransceiver;
  id: string;
  config: LoaderConfig;

  getModuleDeclaration(): ModuleDeclaration {
    return {
      events: {
        provided: ["ui:memory:write", "ui:memory:bulk:write"],
        required: {
          "system:load_finish": this.onLoadFinish,
        },
        optional: {},
      },
    };
  }

  constructor(
    id: string,
    config: Record<string, unknown> | undefined,
    eventTransceiver: TypedEventTransceiver,
  ) {
    this.evt = eventTransceiver;
    this.id = id;

    console.log(`[${this.id}] Initializing module.`);

    // Verify that configuration is ok.
    if (!config) throw new Error(`[${this.id}] No configuration provided`);
    this.config = validateLoaderConfig(config);

    console.log(`[${this.id}] Initialized with config:`, this.config);
  }

  onLoadFinish = (): void => {
    fetch(this.config.file)
      .then((r) => r.arrayBuffer())
      .then((buffer) => new Uint8Array(buffer))
      .then((bytes) => {
        this.evt.emit("ui:memory:bulk:write", bytes);
      });
  };
}

export default Loader;
