import type { SimulatorConfig } from "../types/config.js";
import type { IModule, ModuleConstructor } from "../types/module.js";
import type {
  EventNames,
  EventCallback,
  EventParams,
  EventDeclaration,
  EventMap,
} from "../types/event.js";
import type { ISimulator } from "../types/simulator.js";

// NOTA: Ahora mismo estoy utilizando un método init para cargar los módulos y
// preparar el simulador. Veo otras opciones:
// - Crear un método estático para cargar los módulos, y una vez cargados,
//   crear una instancia del simulador, y que él los inicialice.
// - Cargar la configuración en el constructor del simulador, hacer comprobaciones
//   ahí, y luego cargar los módulos en un método init.
class M6809Simulator implements ISimulator {
  modules: Record<string, IModule> = {};
  event_declarations: Record<string, EventDeclaration> = {};

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
      // TODO: Check that the config is valid.
      const module_config = config.modules[i];
      const moduleId = module_config.id;

      // Check that the module has an id, and that it's unique.
      if (!moduleId) throw new Error(`Module #${i} has no id`);

      if (module_ids.includes(moduleId)) throw new Error(`Module ${moduleId} is duplicated`);
      module_ids.push(moduleId);

      // Get the module constructor (that the controller has pre-loaded for us),
      // and create an instance of the module. The module will check its own
      // config.
      const Module = modules[i];

      // We create an anonymous object with the emit and on methods, but instead
      // of calling this class' methods, call the namedEmit and namedOn methods.
      // This way, the module can only emit and listen to the events it has
      // declared.
      const module = new Module(moduleId, module_config.config, {
        emit: (event, ...args) => this.namedEmit(moduleId, event, ...args),
        on: (event, callback) => this.namedOn(moduleId, event, callback),
        once: (event, callback) => this.namedOnce(moduleId, event, callback),
        wait: (event) => this.namedWait(moduleId, event),
        emitAndWait: (emittedEvent, event, ...args) =>
          this.namedEmitAndWait(moduleId, emittedEvent, event, ...args),
      });

      const eventDeclaration = module.getEventDeclaration();
      required_events.push(...Object.keys(eventDeclaration.required));
      provided_events.push(...eventDeclaration.provided);

      // Store the event declaration and the module instance.
      this.event_declarations[moduleId] = eventDeclaration;
      this.modules[moduleId] = module;
    }

    // Check that all required events are provided.
    for (const event of required_events) {
      // Skip system events, we provide them.
      if (event.startsWith("system:")) continue;

      if (!provided_events.includes(event)) {
        throw new Error(`[M6809Simulator] Event ${event} is required but not provided`);
      }
    }

    // Add all the event listeners.
    for (const eventDeclaration of Object.values(this.event_declarations)) {
      // We know that the event name is in the provided events (it's a valid
      // event declaration), so we can cast it to EventNames.
      // We know that the event is in the event declaration, so we can just
      // call on (instead of onNamed).
      for (const [name, callback] of Object.entries(eventDeclaration.required))
        this.on(name as EventNames, callback as EventCallback<EventNames>);
      for (const [name, callback] of Object.entries(eventDeclaration.optional))
        this.on(name as EventNames, callback as EventCallback<EventNames>);
    }

    console.log(`[${this.constructor.name}] Initialized M6809 simulator`);
    this.emit("system:load_finish");
  }

  /**
   * Emit an event.
   */
  emit<E extends EventNames>(event: E, ...args: EventParams<E>): void {
    console.debug(`[${this.constructor.name}] Emitting event ${event}(${args.join(", ")})`);

    // If there are no listeners for this event, do nothing.
    if (!this.events[event]) return;

    for (const callback of this.events[event]) {
      callback(...args);
    }
  }
  /**
   * Add a new event listener.
   * **NOTE: Don't forget to correctly bind the function to the class instance
   *       when calling this method.**
   */
  on<E extends EventNames>(event: E, callback: EventCallback<E>): void {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  }
  /**
   * Add a new event listener that only gets called once.
   * **NOTE: Don't forget to correctly bind the function to the class instance
   *       when calling this method.**
   */
  once<E extends EventNames>(event: E, callback: EventCallback<E>): void {
    if (!this.events[event]) this.events[event] = [];

    let fired = false;
    const wrappedCallback = (...args: EventParams<E>) => {
      // TODO: Probably unneeded, because execution _will not_ be taken away
      // from JavaScript synchronous code.
      if (!fired) {
        fired = true;

        // This quickly raised alarm bells in my head, because it looks like there could
        // be a read-write race condition here.
        // - I get the event list
        // - somebody appends
        // - I filter from my event list
        // ... and now the other append is nowhere to be seen.
        // But after looking around, and making some tests, it seems like the JavaScript event
        // loop being single-threaded prevents this specific kind of race condition! Go JS!
        this.events[event] = this.events[event].filter((x) => x !== wrappedCallback);
        callback(...args);
      }
    };
    this.events[event].push(wrappedCallback);
  }
  /**
   * once but in promise.
   */
  wait<E extends EventNames>(event: E): Promise<EventParams<E>> {
    return new Promise((resolve, reject) => {
      this.once(event, (...args: EventParams<E>) => resolve(args));
    });
  }
  /**
   * 
   */
  emitAndWait<E extends EventNames>(
    emittedEvent: E,
    event: E,
    ...args: EventParams<E>
  ): Promise<EventParams<E>> {
    const promise = this.wait(event);
    this.emit(emittedEvent, ...args);
    return promise;
  }

  /**
   * Add a new event listener, but check that the event is declared in the module.
   * **NOTE: Don't forget to correctly bind the function to the class instance
   *       when calling this method.**
   */
  namedOn<E extends EventNames>(caller: string, event: E, callback: EventCallback<E>): void {
    if (!this.event_declarations[caller])
      throw new Error(`[${caller}] Module has no event declaration`);
    const eventDeclaration = this.event_declarations[caller];
    if (!(event in eventDeclaration.required) && !(event in eventDeclaration.optional))
      throw new Error(`[${caller}] Cannot listen to event ${event}.`);

    this.on(event, callback);
  }
  /**
   * once, but check that the event is declared in the module.
   * **NOTE: Don't forget to correctly bind the function to the class instance
   *       when calling this method.**
   */
  namedOnce<E extends EventNames>(caller: string, event: E, callback: EventCallback<E>): void {
    if (!this.event_declarations[caller])
      throw new Error(`[${caller}] Module has no event declaration`);
    const eventDeclaration = this.event_declarations[caller];
    if (!(event in eventDeclaration.required) && !(event in eventDeclaration.optional))
      throw new Error(`[${caller}] Cannot listen to event ${event}.`);

    this.once(event, callback);
  }
  /**
   * wait, but check that the event is declared in the module.
   * **NOTE: Don't forget to correctly bind the function to the class instance
   *       when calling this method.**
   */
  namedWait<E extends EventNames>(caller: string, event: E): Promise<EventParams<E>> {
    if (!this.event_declarations[caller])
      throw new Error(`[${caller}] Module has no event declaration`);
    const eventDeclaration = this.event_declarations[caller];
    if (!(event in eventDeclaration.required) && !(event in eventDeclaration.optional))
      throw new Error(`[${caller}] Cannot listen to event ${event}.`);

    return this.wait(event);
  }
  /**
   * Emit an event, but check that the event is declared in the module.
   */
  namedEmit<E extends EventNames>(caller: string, event: E, ...args: EventParams<E>): void {
    if (!this.event_declarations[caller])
      throw new Error(`[${caller}] Module has no event declaration`);
    const eventDeclaration = this.event_declarations[caller];
    if (!eventDeclaration.provided.includes(event))
      throw new Error(`[${caller}] Cannot emit event ${event}.`);

    this.emit(event, ...args);
  }
  /**
   * Add a new once event listener, and emits an event, but checks that the event
   * is declared in the module before.
   */
  namedEmitAndWait<E extends EventNames>(
    caller: string,
    emittedEvent: E,
    event: E,
    ...args: EventParams<E>
  ): Promise<NonNullable<EventParams<E>>> {
    if (!this.event_declarations[caller])
      throw new Error(`[${caller}] Module has no event declaration`);
    const eventDeclaration = this.event_declarations[caller];
    if (!(event in eventDeclaration.required) && !(event in eventDeclaration.optional))
      throw new Error(`[${caller}] Cannot listen to event ${event}.`);
    if (!eventDeclaration.provided.includes(emittedEvent))
      throw new Error(`[${caller}] Cannot emit event ${emittedEvent}.`);

    return this.emitAndWait(emittedEvent, event, ...args);
  }  
}

export default M6809Simulator;
