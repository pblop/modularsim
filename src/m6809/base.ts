import type { SimulatorConfig } from "../types/config.js";
import type { IModule, ModuleConstructor } from "../types/module.js";
import type {
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
  EventBaseName,
  EventName,
  TypedEventTransceiver,
} from "../types/event.js";
import type { ISimulator } from "../types/simulator.js";
import { PriorityQueue } from "../general/priority.js";
import { separateEventName } from "../general/event.js";

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
  callback: AnyEventCallback;
  priority: EventQueuePriority;
};
class ClockQueue {
  queue: PriorityQueue<EventQueueElement>;
  // The number of times the event has happened since the start of the simulation, starting on 1.
  ticks = 0;

  cmp = (a: EventQueueElement, b: EventQueueElement) =>
    a.priority.tick - b.priority.tick || a.priority.order - b.priority.order;

  constructor() {
    this.queue = new PriorityQueue(this.cmp);
  }

  enqueue(callback: AnyEventCallback, priority: EventQueuePriority) {
    this.queue.enqueue({ callback, priority });
  }
  size() {
    return this.queue.size();
  }
  isEmpty() {
    return this.queue.isEmpty();
  }
  hasFinishedIndex() {
    if (this.isEmpty()) return true;
    // If <, we have a big issue
    // If ==, we haven't finished
    // If >, we have finished
    return this.queue.peek()!.priority.tick > this.ticks;
  }
  dequeue(): [AnyEventCallback, number] | undefined {
    const el = this.queue.dequeue();
    if (!el) return undefined;

    return [el.callback, el.priority.tick];
  }
  debugView() {
    const sorted = this.queue._heap.slice().sort(this.cmp);
    return sorted.reduce((acc: Map<string, AnyEventCallback[]>, el) => {
      const str = `${el.priority.tick}|${el.priority.order}`;
      if (!acc.has(str)) acc.set(str, []);
      acc.get(str)!.push(el.callback);
      return acc;
    }, new Map());
  }

  incrementTick() {
    this.ticks++;
  }
}

type SubscribersType = {
  [B in EventBaseName as B | `${B}/${string}`]?: EventCallback<B>[];
};
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
  subscribers: Record<string, EventCallback<any>[]> = {};
  queue: ClockQueue;

  constructor(config: SimulatorConfig, modules: ModuleConstructor[]) {
    console.log("Initializing M6809 simulator");

    this.subscribers = {};
    this.queue = new ClockQueue();

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
      const module = new Module(
        moduleId,
        module_config.config,
        this.asTransceiver({ module: moduleId }),
      );

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
    this.emit("*", "system:load_finish");
  }

  performCycle() {
    // We're emitting an event, so we increment the index of the event queue (all the
    // new listeners will be added to the index following this one).
    this.queue.incrementTick();

    while (!this.queue.hasFinishedIndex()) {
      const [callback, tick] = this.subscribers[event].dequeue()!;
      const context: EventContext = {
        emitter: caller,
        cycle: this.queue.tick,
      };
      if (!callback) {
        throw new Error("[MC6809] callback for listener is undefined");
      }
      callback(...args, context);
    }
  }

  /**
   * Internal method to add event listeners from an (E)vent (D)eclaration to the
   * event queue. No checks are performed, as the event declaration is assumed
   * to be correct.
   * @param listeners The event listeners to add.
   */
  addEDListeners<B extends EventBaseName, E extends EventName<B>>(
    module: ModuleID,
    listeners: EventDeclarationListeners,
  ) {
    for (const [name, object] of Object.entries(listeners)) {
      if (object == null) continue;

      let subtickPriority: SubtickPriority | undefined;
      let callback: EventCallback<B>;

      // We know that the event name is in the provided events (it's a valid
      // event declaration), so we can cast it safely.
      if (typeof object === "function") {
        callback = object as EventCallback<B>;
      } else {
        [callback, subtickPriority] = object as [EventCallback<B>, SubtickPriority];
      }

      // We know that the event is in the event declaration, and, thus, properly
      // accounted for and checked, so we can just call on (instead of onNamed).
      this.on(module, name as E, callback, subtickPriority);
    }
  }

  /**
   * Emit an event.
   */
  emit<B extends EventBaseName>(caller: string, event: EventName<B>, ...args: EventParams<B>) {
    const subscribers = this.subscribers[event] as EventCallback<B>[] | undefined;

    if (!subscribers) return;

    const context: EventContext = {
      emitter: caller,
      cycle: this.queue.ticks,
    };

    // We copy the array to prevent issues when the callback modifies the array
    // - if the callback is ephemeral, it will be removed.
    // - the callback can add new listeners, and we don't want to:
    //   - call them in this iteration
    //   - iterate wrong because of the new elements
    for (const listener of subscribers.slice()) {
      listener(...args, context);
    }
  }

  /**
   * Add a new event listener.
   * **NOTE: Don't forget to correctly bind the function to the class instance
   *       when calling this method.**
   */
  on<B extends EventBaseName>(
    caller: ModuleID,
    event: EventName<B>,
    callback: EventCallback<B>,
  ): void {
    if (!this.subscribers[event]) this.subscribers[event] = [];
    this.subscribers[event].push(callback);
  }
  /**
   * Add a new event listener that only gets called once.
   * **NOTE: Don't forget to correctly bind the function to the class instance
   *       when calling this method.**
   */
  once<B extends EventBaseName>(
    caller: ModuleID,
    event: EventName<B>,
    callback: EventCallback<B>,
  ): void {
    if (!this.subscribers[event]) this.subscribers[event] = [];

    const wrappedCallback: EventCallback<B> = (...args: EventCallbackArgs<B>) => {
      // This quickly raised alarm bells in my head, because it looks like there could
      // be a read-write race condition here.
      // - I get the event list
      // - somebody appends
      // - I filter from my event list
      // ... and now the other append is nowhere to be seen.
      // But after looking around, and making some tests, it seems like the JavaScript event
      // loop being single-threaded prevents this specific kind of race condition! Go JS!
      this.subscribers[event] = this.subscribers[event].filter((x) => x !== wrappedCallback);
      return callback(...args);
    };
    this.subscribers[event].unshift(wrappedCallback);
  }
  /**
   * once but in promise.
   */
  wait<E extends EventBaseName>(
    caller: ModuleID,
    event: EventName<E>,
  ): Promise<EventCallbackArgs<E>> {
    return new Promise((resolve, reject) => {
      this.once(caller, event, (...args: EventCallbackArgs<E>) => resolve(args));
    });
  }

  emitAndWait<L extends EventBaseName, E extends EventBaseName>(
    caller: ModuleID,
    listened: EventName<L>,
    emitted: EventName<E>,
    ...args: EventParams<E>
  ): Promise<EventCallbackArgs<L>> {
    const promise = this.wait(caller, listened);
    this.emit(caller, emitted, ...args);
    return promise;
  }

  asTransceiver({
    module,
    secure,
  }: { module?: ModuleID; secure?: boolean }): TypedEventTransceiver {
    module = module ?? "*";

    if (secure) return this.asSecureTransceiver(module);
    return this.asInsecureTransceiver(module);
  }
  asSecureTransceiver(module: ModuleID): TypedEventTransceiver {
    return {
      emit: this.permissionsWrapper(module, ["emit"], this.emit),
      on: this.permissionsWrapper(module, ["listen"], this.on),
      once: this.permissionsWrapper(module, ["listen"], this.once),
      wait: this.permissionsWrapper(module, ["listen"], this.wait),
      emitAndWait: this.permissionsWrapper(module, ["emit", "listen"], this.emitAndWait),
    };
  }
  asInsecureTransceiver(module: ModuleID = "*"): TypedEventTransceiver {
    return {
      emit: this.permissionsWrapper(module, [], this.emit),
      on: this.permissionsWrapper(module, [], this.on),
      once: this.permissionsWrapper(module, [], this.once),
      wait: this.permissionsWrapper(module, [], this.wait),
      emitAndWait: this.permissionsWrapper(module, [], this.emitAndWait),
    };
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
    fun: (caller: ModuleID, event: EventName, ...args: any) => any,
    // biome-ignore lint/suspicious/noExplicitAny: <above>
  ): ((event: EventName, ...args: any) => any) => {
    if (actions.length === 0) {
      // biome-ignore lint/suspicious/noExplicitAny: <above>
      return (event: EventName, ...args: any) => fun.bind(this)(caller, event, ...args);
    } else if (actions.length === 1) {
      // biome-ignore lint/suspicious/noExplicitAny: <above>
      return (event: EventName, ...args: any) => {
        if (actions.includes("listen")) this.permissionsCheckListen(caller, event);
        if (actions.includes("emit")) this.permissionsCheckEmit(caller, event);
        return fun.bind(this)(caller, event, ...args);
      };
    } else {
      // This is a special case, as we need to get the name of the event being
      // emitted and listened to.
      // biome-ignore lint/suspicious/noExplicitAny: <above>
      return (listened: EventName, emitted: EventName, ...args: any) => {
        if (actions.includes("listen")) this.permissionsCheckListen(caller, listened);
        if (actions.includes("emit")) this.permissionsCheckEmit(caller, emitted);
        return fun.bind(this)(caller, listened, emitted, ...args);
      };
    }
  };

  permissionsCheckEmit(caller: string, event: EventName): void {
    const [base, group] = separateEventName(event);

    if (!this.event_declarations[caller])
      throw new Error(`[${caller}] Module has no event declaration`);
    const eventDeclaration = this.event_declarations[caller];
    if (!eventDeclaration.provided.includes(base))
      throw new Error(`[${caller}] Cannot emit event ${event}.`);
  }
  permissionsCheckListen(caller: string, event: EventName): void {
    const [base, group] = separateEventName(event);

    if (!this.event_declarations[caller])
      throw new Error(`[${caller}] Module has no event declaration`);
    const eventDeclaration = this.event_declarations[caller];
    if (
      !(base in eventDeclaration.required) &&
      (!eventDeclaration.optional || !(base in eventDeclaration.optional))
    )
      throw new Error(`[${caller}] Cannot listen to event ${event}.`);
  }
}

export default M6809Simulator;
