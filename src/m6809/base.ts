import type { SimulatorConfig } from "../types/config.js";
import type { IModule, ModuleConstructor } from "../types/module.js";
import type {
  EventNames,
  EventCallback,
  EventParams,
  EventDeclaration,
  EventMap,
  ListenerPriority,
} from "../types/event.js";
import type { ISimulator } from "../types/simulator.js";
import { PriorityQueue } from "../general/priority.js";

type EventQueuePriority = {
  // The index of the tick when the event should be executed (starting on 1).
  index: number;
  order: number;
};
type EventQueueElement = {
  // Any is used here because the event names can be dynamic (while developing
  // the app, all events are known, but because of the extensibility of the
  // architecture, it's better to allow any string as an event name).
  // biome-ignore lint/suspicious/noExplicitAny: see above
  callback: EventCallback<any>;
  priority: EventQueuePriority;
};
class EventQueue {
  queue: PriorityQueue<EventQueueElement>;
  // The number of ticks that have passed since the start of the simulation (1 is the first tick).
  ticks: number;

  constructor() {
    this.queue = new PriorityQueue(
      (a, b) => a.priority.index - b.priority.index || a.priority.order - b.priority.order,
    );
    this.ticks = 0;
  }

  // biome-ignore lint/suspicious/noExplicitAny: see above
  enqueue(callback: EventCallback<any>, priority: EventQueuePriority) {
    this.queue.enqueue({ callback, priority });
  }
  size() {
    return this.queue.size();
  }
  isEmpty() {
    return this.queue.isEmpty();
  }
  hasFinishedIndex() {
    if (this.queue.isEmpty()) return true;
    // If <, we have a big issue
    // If ==, we haven't finished
    // If >, we have finished
    return this.queue.peek()!.priority.index > this.ticks;
  }
  dequeue() {
    return this.queue.dequeue()?.callback;
  }
  debugView() {
    const sorted = this.queue._heap.sort(
      (a, b) => a.priority.index - b.priority.index || a.priority.order - b.priority.order,
    );
    return sorted.reduce(
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      (acc: Map<string, EventCallback<any>[]>, el) => {
        const str = `${el.priority.index}|${el.priority.order}`;
        if (!acc.has(str)) acc.set(str, []);
        acc.get(str)!.push(el.callback);
        return acc;
      },
      new Map(),
    );
  }

  incrementIndex() {
    this.ticks++;
  }
}

// NOTA: Ahora mismo estoy utilizando un método init para cargar los módulos y
// preparar el simulador. Veo otras opciones:
// - Crear un método estático para cargar los módulos, y una vez cargados,
//   crear una instancia del simulador, y que él los inicialice.
// - Cargar la configuración en el constructor del simulador, hacer comprobaciones
//   ahí, y luego cargar los módulos en un método init.
class M6809Simulator implements ISimulator {
  modules: Record<string, IModule> = {};
  event_declarations: Record<string, EventDeclaration> = {};

  events: Record<string, EventQueue> = {};

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
        emit: (...args) => this.namedEmit(moduleId, ...args),
        on: (...args) => this.namedOn(moduleId, ...args),
        once: (...args) => this.namedOnce(moduleId, ...args),
        wait: (...args) => this.namedWait(moduleId, ...args),
        emitAndWait: (...args) => this.namedEmitAndWait(moduleId, ...args),
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
      for (const [name, callbackObject] of Object.entries(eventDeclaration.required)) {
        if (callbackObject == null) continue;
        if (typeof callbackObject === "function") {
          this.on(name as EventNames, callbackObject as EventCallback<EventNames>);
        } else {
          const [callback, order] = callbackObject;
          this.on(name as EventNames, callback as EventCallback<EventNames>, { order });
        }
      }
      if (eventDeclaration.optional)
        for (const [name, callback] of Object.entries(eventDeclaration.optional))
          this.on(name as EventNames, callback as EventCallback<EventNames>);
    }

    console.log(`[${this.constructor.name}] Initialized M6809 simulator`);
    this.emit("system:load_finish");
  }

  /**
   * Emit an event.
   */
  emit<E extends EventNames>(event: E, ...args: EventParams<E>) {
    console.debug(`[${this.constructor.name}] Emitting event ${event}(${args.join(", ")})`);

    // If there are no listeners for this event, do nothing.
    if (!this.events[event]) return;

    // We're emitting an event, so we increment the index of the event queue (all the
    // new listeners will be added to the index following this one).
    this.events[event].incrementIndex();

    while (!this.events[event].hasFinishedIndex()) {
      const callback = this.events[event].dequeue();
      if (!callback) {
        throw new Error("[MC6809] callback for listener is undefined");
      }
      callback(...args);
    }
  }
  /**
   * Add a new event listener.
   * **NOTE: Don't forget to correctly bind the function to the class instance
   *       when calling this method.**
   */
  on<E extends EventNames>(
    event: E,
    callback: EventCallback<E>,
    listenerPriority?: ListenerPriority,
  ): void {
    const wrappedCallback = (...args: EventParams<E>) => {
      callback(...args);
      this.once(event, wrappedCallback, listenerPriority);
    };
    this.once(event, wrappedCallback, listenerPriority);
  }
  /**
   * Add a new event listener that only gets called once.
   * **NOTE: Don't forget to correctly bind the function to the class instance
   *       when calling this method.**
   */
  once<E extends EventNames>(
    event: E,
    callback: EventCallback<E>,
    listenerPriority?: ListenerPriority,
  ): void {
    if (!this.events[event]) this.events[event] = new EventQueue();

    const queue = this.events[event];

    // Set defaults for order and index, and calculate the latter in case an
    // offset is given.
    const order = listenerPriority?.order ?? 0;

    let index = queue.ticks + 1;
    if (listenerPriority?.index) index = listenerPriority.index;
    else if (listenerPriority?.indexOffset) {
      if (listenerPriority.indexOffset < 0) throw new Error("Index offset must be positive");
      index += listenerPriority.indexOffset;
    }

    this.events[event].enqueue(callback, { index, order });
  }
  /**
   * once but in promise.
   */
  wait<E extends EventNames>(
    event: E,
    listenerPriority?: ListenerPriority,
  ): Promise<EventParams<E>> {
    return new Promise((resolve, reject) => {
      this.once(event, (...args: EventParams<E>) => resolve(args), listenerPriority);
    });
  }
  /**
   *
   */
  emitAndWait<E extends EventNames, F extends EventNames>(
    emittedEvent: E,
    event: F,
    ...args: EventParams<E>
  ): Promise<EventParams<F>> {
    const promise = this.wait(event);
    this.emit(emittedEvent, ...args);
    return promise;
  }

  namedEmitterCheck(caller: string, event: EventNames): void {
    if (!this.event_declarations[caller])
      throw new Error(`[${caller}] Module has no event declaration`);
    const eventDeclaration = this.event_declarations[caller];
    if (!eventDeclaration.provided.includes(event))
      throw new Error(`[${caller}] Cannot emit event ${event}.`);
  }
  namedListenerCheck(caller: string, event: EventNames): void {
    if (!this.event_declarations[caller])
      throw new Error(`[${caller}] Module has no event declaration`);
    const eventDeclaration = this.event_declarations[caller];
    if (
      !(event in eventDeclaration.required) &&
      (!eventDeclaration.optional || !(event in eventDeclaration.optional))
    )
      throw new Error(`[${caller}] Cannot listen to event ${event}.`);
  }

  /**
   * Add a new event listener, but check that the event is declared in the module.
   * **NOTE: Don't forget to correctly bind the function to the class instance
   *       when calling this method.**
   */
  namedOn<E extends EventNames>(
    caller: string,
    event: E,
    callback: EventCallback<E>,
    listenerPriority?: ListenerPriority,
  ): void {
    this.namedListenerCheck(caller, event);
    this.on(event, callback, listenerPriority);
  }
  /**
   * once, but check that the event is declared in the module.
   * **NOTE: Don't forget to correctly bind the function to the class instance
   *       when calling this method.**
   */
  namedOnce<E extends EventNames>(
    caller: string,
    event: E,
    callback: EventCallback<E>,
    listenerPriority?: ListenerPriority,
  ): void {
    this.namedListenerCheck(caller, event);
    this.once(event, callback, listenerPriority);
  }
  /**
   * wait, but check that the event is declared in the module.
   * **NOTE: Don't forget to correctly bind the function to the class instance
   *       when calling this method.**
   */
  namedWait<E extends EventNames>(
    caller: string,
    event: E,
    listenerPriority?: ListenerPriority,
  ): Promise<EventParams<E>> {
    this.namedListenerCheck(caller, event);
    return this.wait(event, listenerPriority);
  }
  /**
   * Emit an event, but check that the event is declared in the module.
   */
  namedEmit<E extends EventNames>(caller: string, event: E, ...args: EventParams<E>): void {
    this.namedEmitterCheck(caller, event);
    this.emit(event, ...args);
  }
  /**
   * Add a new once event listener, and emits an event, but checks that the event
   * is declared in the module before.
   */
  namedEmitAndWait<E extends EventNames, F extends EventNames>(
    caller: string,
    emittedEvent: E,
    event: F,
    ...args: EventParams<E>
  ): Promise<NonNullable<EventParams<F>>> {
    this.namedEmitterCheck(caller, emittedEvent);
    this.namedListenerCheck(caller, event);

    return this.emitAndWait(emittedEvent, event, ...args);
  }
}

export default M6809Simulator;
