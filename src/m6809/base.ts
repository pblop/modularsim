import type { SimulatorConfig } from "../types/config.js";
import type { IModule, ModuleConstructor } from "../types/module.js";
import type { EventNames, EventCallback, EventParams } from "../types/event.js";
import type { ISimulator } from "../types/simulator.js";

// NOTA: Ahora mismo estoy utilizando un método init para cargar los módulos y
// preparar el simulador. Veo otras opciones:
// - Crear un método estático para cargar los módulos, y una vez cargados,
//   crear una instancia del simulador, y que él los inicialice.
// - Cargar la configuración en el constructor del simulador, hacer comprobaciones
//   ahí, y luego cargar los módulos en un método init.
class M6809Simulator implements ISimulator {
  modules: Record<string, IModule> = {};

  // Any is used here because the event names can be dynamic (while developing
  // the app, all events are known, but because of the extensibility of the
  // architecture, it's better to allow any string as an event name).
  // biome-ignore lint/suspicious/noExplicitAny: see above
  events: Record<string, EventCallback<any>[]> = {};

  constructor(config: SimulatorConfig, modules: ModuleConstructor[]) {
    console.log("Initializing M6809 simulator");

    this.events = {};

    // Check that the config has the required fields.
    if (!config.modules) throw new Error("No modules defined");

    const required_events = [];
    const provided_events = [];
    const module_ids: string[] = [];

    for (let i = 0; i < config.modules.length; i++) {
      const module_config = config.modules[i];

      // Check that the module has an id, and that it's unique.
      if (!module_config.id) throw new Error(`Module #${i} has no id`);
      if (module_ids.includes(module_config.id))
        throw new Error(`Module ${module_config.id} is duplicated`);
      module_ids.push(module_config.id);

      // Get the module constructor (that the controller has pre-loaded for us),
      // and create an instance of the module. The module will check its own
      // config.
      const Module = modules[i];
      const module = new Module(module_config.id, module_config.config, this);

      required_events.push(...module.getEventDeclaration().required);
      provided_events.push(...module.getEventDeclaration().provided);
      this.modules[module_config.id] = module;
    }

    // Check that all required events are provided.
    for (const event of required_events) {
      // Skip system events, they we provide them.
      if (event.startsWith("system:")) continue;

      if (!provided_events.includes(event)) {
        throw new Error(`[M6809Simulator] Event ${event} is required but not provided`);
      }
    }

    console.log(`[${this.constructor.name}] Initialized M6809 simulator`);
    this.emit("system:load_finish");
  }

  // Add a new event listener.
  // NOTE: Don't forget to correctly bind the function to the class instance
  //       when calling this method.
  on<E extends EventNames>(event: E, callback: EventCallback<E>): void {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  }
  // Emit an event.
  emit<E extends EventNames>(event: E, ...args: EventParams<E>): void {
    // If there are no listeners for this event, do nothing.
    if (!this.events[event]) return;

    for (const callback of this.events[event]) {
      callback(...args);
    }
  }
}

export default M6809Simulator;
