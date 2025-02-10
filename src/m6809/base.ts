import type { SimulatorConfig } from "../types/config.js";
import type { IModule, ModuleConstructor } from "../types/module.js";
import type {
  EventNames,
  EventCallback,
  EventParams,
  EventDeclaration,
  EventMap,
  ListenerPriority,
  EventDeclarationListeners,
  SubtickPriority,
  EventContext,
  ModuleID,
  EventCallbackArgs,
} from "../types/event.js";
import type { ISimulator } from "../types/simulator.js";
import { PriorityQueue } from "../general/priority.js";

type EventQueuePriority = {
  // The tick when the event should be executed (starting on 1).
  tick: number;
  order: number;
};
// Any is used here because the event names can be dynamic (while developing
// the app, all events are known, but because of the extensibility of the
// architecture, it's better to allow any string as an event name).
// biome-ignore lint/suspicious/noExplicitAny: see above
type AnyEventCallback = EventCallback<any>;
type EventQueueElement = {
  module: ModuleID;
  callback: AnyEventCallback;
  priority: EventQueuePriority;
};
class EventQueue {
  queue: PriorityQueue<EventQueueElement>;
  // The number of times the event has happened since the start of the simulation, starting on 1.
  // Since we have directed messages, we have global ticks (for all modules) and
  // the additional, per-module, ticks.
  // The ticks for each module are globalTicks + perModuleTicks[module].
  perModuleTicks: Record<ModuleID, number> = {};
  globalTicks = 0;

  cmp = (a: EventQueueElement, b: EventQueueElement) =>
    this._distanceToNextTick(a) - this._distanceToNextTick(b) ||
    a.priority.order - b.priority.order;

  constructor() {
    this.queue = new PriorityQueue(this.cmp);
  }

  _distanceToNextTick(e: EventQueueElement) {
    return e.priority.tick - this.ticks(e.module);
  }
  ticks(module: ModuleID) {
    return this.globalTicks + (this.perModuleTicks[module] ?? 0);
  }

  enqueue(module: ModuleID, callback: AnyEventCallback, priority: EventQueuePriority) {
    this.perModuleTicks[module] ??= 0;
    this.queue.enqueue({ module, callback, priority });
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
    return this._distanceToNextTick(this.queue.peek()!) > 0;
  }
  dequeue(): [ModuleID, AnyEventCallback, number] | undefined {
    const element = this.queue.dequeue();
    if (!element) return;

    return [element.module, element.callback, this.perModuleTicks[element.module]];
  }
  debugView() {
    const sorted = this.queue._heap.sort(this.cmp);
    return sorted.reduce((acc: Map<string, AnyEventCallback[]>, el) => {
      const str = `${el.priority.tick}|${el.priority.order}(${el.module})`;
      if (!acc.has(str)) acc.set(str, []);
      acc.get(str)!.push(el.callback);
      return acc;
    }, new Map());
  }

  incrementTick(modules: ModuleID[]) {
    if (modules.length === 0) {
      this.globalTicks++;
    } else {
      for (const module of modules) this.perModuleTicks[module]++;
    }
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

      // We create a transceiver for the module, with the methods it can use,
      // and bind it to its module id. This way, the module can only emit and
      // listen to the events it has declared, and the sender field is
      // automatically filled.
      const module = new Module(moduleId, module_config.config, {
        emit: this.permissionsWrapper(moduleId, ["emit"], this.emit),
        broadcast: this.permissionsWrapper(moduleId, ["emit"], this.broadcast),
        on: this.permissionsWrapper(moduleId, ["listen"], this.on),
        once: this.permissionsWrapper(moduleId, ["listen"], this.once),
        wait: this.permissionsWrapper(moduleId, ["listen"], this.wait),
        emitAndWait: this.permissionsWrapper(moduleId, ["emit", "listen"], this.emitAndWait),
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
    for (const [module, eventDeclaration] of Object.entries(this.event_declarations)) {
      this.addEDListeners(module, eventDeclaration.required);
      if (eventDeclaration.optional) this.addEDListeners(module, eventDeclaration.optional);
    }

    console.log(`[${this.constructor.name}] Initialized M6809 simulator`);
    this.emit("*", "system:load_finish", []);
  }

  /**
   * Internal method to add event listeners from an (E)vent (D)eclaration to the
   * event queue. No checks are performed, as the event declaration is assumed
   * to be correct.
   * @param listeners The event listeners to add.
   */
  addEDListeners<E extends EventNames>(module: ModuleID, listeners: EventDeclarationListeners) {
    for (const [name, object] of Object.entries(listeners)) {
      if (object == null) continue;

      let subtickPriority: SubtickPriority | undefined;
      let callback: EventCallback<E>;

      // We know that the event name is in the provided events (it's a valid
      // event declaration), so we can cast it safely.
      if (typeof object === "function") {
        callback = object as EventCallback<E>;
      } else {
        [callback, subtickPriority] = object as [EventCallback<E>, SubtickPriority];
      }

      // We know that the event is in the event declaration, and, thus, properly
      // accounted for and checked, so we can just call on (instead of onNamed).
      this.on(module, name as E, callback, subtickPriority);
    }
  }

  /**
   * Emit an event.
   */
  emit<E extends EventNames>(
    caller: ModuleID,
    event: E,
    receivers: ModuleID[],
    ...args: EventParams<E>
  ) {
    console.debug(`[${this.constructor.name}] Emitting event ${event}(${args.join(", ")})`);

    // If there are no listeners for this event, do nothing.
    if (!this.events[event]) return;

    // We're emitting an event, so we increment the index of the event queue (all the
    // new listeners will be added to the index following this one).
    this.events[event].incrementTick(receivers);

    while (!this.events[event].hasFinishedIndex()) {
      const [module, callback, tick] = this.events[event].dequeue()!;
      const context: EventContext = {
        emitter: caller,
        receivers,
        tick,
      };
      if (!callback) {
        throw new Error("[MC6809] callback for listener is undefined");
      }
      callback(...args, context);
    }
  }
  broadcast<E extends EventNames>(caller: ModuleID, event: E, ...args: EventParams<E>): void {
    this.emit(caller, event, [], ...args);
  }

  /**
   * Add a new event listener.
   * **NOTE: Don't forget to correctly bind the function to the class instance
   *       when calling this method.**
   */
  on<E extends EventNames>(
    caller: ModuleID,
    event: E,
    callback: EventCallback<E>,
    listenerPriority?: SubtickPriority,
  ): void {
    const wrappedCallback = (...args: EventCallbackArgs<E>) => {
      callback(...args);
      this.once(caller, event, wrappedCallback, listenerPriority);
    };
    this.once(caller, event, wrappedCallback, listenerPriority);
  }
  /**
   * Add a new event listener that only gets called once.
   * **NOTE: Don't forget to correctly bind the function to the class instance
   *       when calling this method.**
   */
  once<E extends EventNames>(
    caller: ModuleID,
    event: E,
    callback: EventCallback<E>,
    listenerPriority?: ListenerPriority,
  ): void {
    if (!this.events[event]) this.events[event] = new EventQueue();

    const queue = this.events[event];

    // Set defaults for order and index, and calculate the latter in case an
    // offset is given.
    const order = listenerPriority?.order ?? 0;

    let tick = queue.ticks(caller) + 1;
    if (listenerPriority?.tick) tick = listenerPriority.tick;
    else if (listenerPriority?.tickOffset) {
      if (listenerPriority.tickOffset < 0) throw new Error("Index offset must be positive");
      tick += listenerPriority.tickOffset;
    }

    this.events[event].enqueue(caller, callback as AnyEventCallback, { tick, order });
  }
  /**
   * once but in promise.
   */
  wait<E extends EventNames>(
    caller: ModuleID,
    event: E,
    listenerPriority?: ListenerPriority,
  ): Promise<EventCallbackArgs<E>> {
    return new Promise((resolve, reject) => {
      this.once(caller, event, (...args: EventCallbackArgs<E>) => resolve(args), listenerPriority);
    });
  }

  emitAndWait<E extends EventNames, L extends EventNames>(
    caller: ModuleID,
    listenedEvent: L,
    secondParam: E | ListenerPriority,
    thirdParam: ModuleID[] | E,
    ...args: unknown[]
  ): Promise<EventCallbackArgs<L>> {
    // This function has _two_ signatures, so we need to check the type of the
    // second argument to know if we have a listenerPriority or not.
    let listenerPriority: ListenerPriority | undefined;
    let receivers: ModuleID[];
    let emittedEvent: E;
    if (typeof secondParam === "object") {
      // emitAndWait(listenedEvent, listenerPriority, emittedEvent, receivers, ...args)
      listenerPriority = secondParam;
      emittedEvent = thirdParam as E;
      receivers = args.shift() as ModuleID[];
    } else {
      // emitAndWait(listenedEvent, emittedEvent, receivers, ...args)
      emittedEvent = secondParam;
      receivers = thirdParam as ModuleID[];
    }

    const promise = this.wait(caller, listenedEvent, listenerPriority);
    // We need to cast args to EventParams<E> because we have no way of telling
    // TypeScript which of the two signatures we're using.
    this.emit(caller, emittedEvent, receivers, ...(args as EventParams<E>));
    return promise;
  }

  /**
   * A helper function to check that the caller can emit and/or listen to an
   * event, and then call the function.
   * It uses any as a type for the arguments because the functions passed can
   * have many shapes, and we can't know them all.
   * It's probably possible to type this better, but it's not worth the effort.
   */
  permissionsWrapper = (
    caller: string,
    actions: ("listen" | "emit")[],
    // biome-ignore lint/suspicious/noExplicitAny: <above>
    fun: (caller: ModuleID, event: EventNames, ...args: any) => any,
  ): // biome-ignore lint/suspicious/noExplicitAny: <above>
  ((event: EventNames, ...args: any) => any) => {
    if (actions.length === 0) {
      return fun.bind(this);
    } else if (actions.length === 1) {
      // biome-ignore lint/suspicious/noExplicitAny: <above>
      return (event: EventNames, ...args: any) => {
        if (actions.includes("listen")) this.permissionsCheckListen(caller, event);
        if (actions.includes("emit")) this.permissionsCheckEmit(caller, event);
        return fun.bind(this)(caller, event, ...args);
      };
    } else {
      // This is a special case, as we need to get the name of the event being
      // emitted and listened to.
      // biome-ignore lint/suspicious/noExplicitAny: <above>
      return (listenedEvent: EventNames, ...args: any) => {
        if (actions.includes("listen")) this.permissionsCheckListen(caller, listenedEvent);

        let emittedEvent: EventNames;
        // We're looking to match the signature of emitAndWait, so we need to
        // check the type of the second argument.
        if (typeof args[0] === "object") {
          emittedEvent = args[1];
        } else {
          emittedEvent = args[0];
        }

        if (actions.includes("emit")) this.permissionsCheckEmit(caller, emittedEvent);
        return fun.bind(this)(caller, listenedEvent, ...args);
      };
    }
  };
  permissionsCheckEmit(caller: string, event: EventNames): void {
    if (!this.event_declarations[caller])
      throw new Error(`[${caller}] Module has no event declaration`);
    const eventDeclaration = this.event_declarations[caller];
    if (!eventDeclaration.provided.includes(event))
      throw new Error(`[${caller}] Cannot emit event ${event}.`);
  }
  permissionsCheckListen(caller: string, event: EventNames): void {
    if (!this.event_declarations[caller])
      throw new Error(`[${caller}] Module has no event declaration`);
    const eventDeclaration = this.event_declarations[caller];
    if (
      !(event in eventDeclaration.required) &&
      (!eventDeclaration.optional || !(event in eventDeclaration.optional))
    )
      throw new Error(`[${caller}] Cannot listen to event ${event}.`);
  }
}

export default M6809Simulator;
