import { separateEventName } from "../../utils/event.js";
import { PriorityQueue } from "../../utils/priority.js";
import type { SimulatorConfig } from "../../types/config.js";
import type {
  CycleCallback,
  CycleDeclarationListener,
  CycleManager,
  FinalListenerPriority,
  ListenerPriority,
  SubcyclePriority,
} from "../../types/cycles.js";
import type {
  EventBaseName,
  EventCallback,
  EventCallbackArgs,
  EventContext,
  EventDeclaration,
  EventDeclarationListeners,
  EventName,
  EventParams,
  ModuleID,
  TypedEventTransceiver,
} from "../../types/event.js";
import type {
  IModule,
  ModuleConstructor,
  ModuleDeclaration,
  SimulationModuleInteraction,
} from "../../types/module.js";
import type { ISimulator } from "../../types/simulator.js";

type ClockQueueElement = {
  id: ModuleID;
  callback: CycleCallback;
  priority: FinalListenerPriority;
};
class ClockQueue {
  queue: PriorityQueue<ClockQueueElement>;
  // The number of cycles since the start of the simulation (the current cycle,
  // or the last cycle if the next one hasn't started yet).
  // The first cycle is 1.
  cycle = 0;
  subcycle = Number.NEGATIVE_INFINITY;

  cmp = (a: ClockQueueElement, b: ClockQueueElement) =>
    a.priority.cycle - b.priority.cycle || a.priority.subcycle - b.priority.subcycle;

  constructor() {
    this.queue = new PriorityQueue(this.cmp);
  }

  enqueue(id: ModuleID, callback: CycleCallback, priority: FinalListenerPriority) {
    this.queue.enqueue({ id, callback, priority });
  }
  size() {
    return this.queue.size();
  }
  isEmpty() {
    return this.queue.isEmpty();
  }
  hasFinishedCycle() {
    if (this.isEmpty()) return true;
    // If <, we have a big issue
    // If ==, we haven't finished
    // If >, we have finished
    return this.queue.peek()!.priority.cycle > this.cycle;
  }
  dequeue(): ClockQueueElement | undefined {
    const elem = this.queue.dequeue();
    if (!elem) return undefined;

    this.subcycle = elem.priority.subcycle;
    return elem;
  }
  debugView() {
    const sorted = this.queue.heap.slice().sort(this.cmp);
    return sorted.reduce((acc: Map<string, CycleCallback[]>, el) => {
      const str = `${el.priority.cycle}|${el.priority.subcycle}`;
      if (!acc.has(str)) acc.set(str, []);
      acc.get(str)!.push(el.callback);
      return acc;
    }, new Map());
  }

  incrementCycle() {
    this.cycle++;
    this.subcycle = Number.NEGATIVE_INFINITY;
  }
  isInPast(cycle: number, subcycle: number) {
    return cycle < this.cycle || (cycle === this.cycle && subcycle < this.subcycle);
  }
}

type SubscribersType = {
  [B in EventBaseName as B | `${B}/${string}`]?: EventCallback<B>[];
};

type DeclarationWithMap = ModuleDeclaration & {
  providedMap?: Map<EventName, boolean>;
};
// NOTA: Ahora mismo estoy utilizando un método init para cargar los módulos y
// preparar el simulador. Veo otras opciones:
// - Crear un método estático para cargar los módulos, y una vez cargados,
//   crear una instancia del simulador, y que él los inicialice.
// - Cargar la configuración en el constructor del simulador, hacer comprobaciones
//   ahí, y luego cargar los módulos en un método init.
class Simulator implements ISimulator {
  modules: Record<string, IModule> = {};
  declarations: Record<string, DeclarationWithMap> = {};

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
    let initiators = 0;

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
      // TODO: Disallow modules from emitting, or listening, until the simulator
      //       has finished loading.
      const module = new Module(
        moduleId,
        module_config.config,
        this.asSimulation({ module: moduleId, secure: true }),
      );

      const declaration: DeclarationWithMap = module.getModuleDeclaration();
      if (declaration.events != null) {
        required_events.push(...Object.keys(declaration.events.required));
        provided_events.push(...declaration.events.provided);
      }
      if (declaration.cycles) {
        if (declaration.cycles.initiator) initiators++;
      }
      if (declaration.events != null) {
        declaration.providedMap = new Map(
          declaration.events.provided.map((event) => [event, true]),
        );
      }

      // Store the event declaration and the module instance.
      this.declarations[moduleId] = declaration;
      this.modules[moduleId] = module;
    }

    // Check that all required events are provided.
    for (const event of required_events) {
      // Skip system events, we provide them.
      if (event.startsWith("system:")) continue;

      if (!provided_events.includes(event)) {
        throw new Error(`[${this.constructor.name}] Event ${event} is required but not provided`);
      }
    }

    if (initiators !== 1)
      throw new Error(
        `[${this.constructor.name}] There must be exactly one cycle initiator module`,
      );

    // Add all the event listeners.
    for (const [module, declaration] of Object.entries(this.declarations)) {
      if (declaration.events) {
        this.addEDListeners(module, declaration.events.required);
        if (declaration.events.optional) this.addEDListeners(module, declaration.events.optional);
      }
      if (declaration.cycles) {
        if (declaration.cycles.permanent) this.addCDListeners(module, declaration.cycles.permanent);
      }
    }

    console.log(`[${this.constructor.name}] Initialized M6809 simulator`);
    this.emit("system", "system:load_finish");
  }

  promises: Promise<unknown>[] = [];
  prev = performance.now();
  async performCycle() {
    // console.log(`[${this.constructor.name}] Performing cycle ${this.queue.cycle}`);
    // We're emitting an event, so we increment the index of the event queue (all the
    // new listeners will be added to the index following this one).
    this.queue.incrementCycle();

    while (!this.queue.hasFinishedCycle()) {
      const callback = this.queue.dequeue()!;
      if (!callback) {
        throw new Error(`[${this.constructor.name}] callback for cycle is undefined`);
      }
      callback.callback.call(this.modules[callback.id], this.queue.cycle, this.queue.subcycle);
      if (this.promises.length > 0) {
        await Promise.all(this.promises);
        this.promises = [];
      }
    }

    // Wait for the microtask queue to be empty before continuing.
    // await new Promise((r) => setTimeout(r, 0));
  }
  onCycle(caller: ModuleID, callback: CycleCallback, priority: SubcyclePriority = {}) {
    const wrappedCallback = (...args: Parameters<CycleCallback>) => {
      callback.apply(this.modules[caller], args);
      this.onceCycle(caller, wrappedCallback, priority);
    };
    this.onceCycle(caller, wrappedCallback, priority);
  }
  onceCycle(caller: ModuleID, callback: CycleCallback, priority: ListenerPriority = {}) {
    // Set defaults for subcycle and cycle, and calculate the latter in case an
    // offset is given.
    const subcycle = priority?.subcycle ?? 0;

    // The next cycle (by default)
    const offset = priority?.offset ?? +1;
    const cycle = priority?.cycle ?? this.queue.cycle + offset;

    // Ensure that the cycle is in the future.
    if (this.queue.isInPast(cycle, subcycle)) {
      throw new Error(
        `Cannot add a listener for cycle ${cycle} and subcycle ${subcycle} because it's in the past (current: ${this.queue.cycle}, ${this.queue.subcycle})`,
      );
    }

    this.queue.enqueue(caller, callback, { cycle, subcycle });
  }
  awaitCycle(caller: ModuleID, priority: ListenerPriority = {}): Promise<number> {
    return new Promise((resolve) => {
      this.onceCycle(caller, resolve, priority);
    });
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
    for (const [name, callback] of Object.entries(listeners)) {
      if (callback == null) continue;

      // We know that the event is in the event declaration, and, thus, properly
      // accounted for and checked, so we can just call on (instead of onNamed).
      this.on(module, name as E, callback as EventCallback<B>);
    }
  }

  /**
   * Internal method to add listeners from a (C)ycle (D)eclaration to the cycle
   * queue. No checks are performed.
   * @returns listeners The cycle listeners to add.
   */
  addCDListeners(module: ModuleID, listeners: CycleDeclarationListener[]) {
    for (const listener of listeners) {
      if (typeof listener === "function") {
        this.onCycle(module, listener);
      } else {
        const [callback, priority] = listener;
        this.onCycle(module, callback, priority);
      }
    }
  }

  /**
   * Emit an event.
   */
  emit<B extends EventBaseName>(caller: string, event: EventName<B>, ...args: EventParams<B>) {
    const [base, group] = separateEventName(event);
    if (!base.startsWith("ui:")) {
      // console.log(`(event) ${caller}: ${base} -> ${group ? group : "all"} with args: `, args);
    }
    const subscribers = this.subscribers[event] as EventCallback<B>[] | undefined;

    if (!subscribers) return;

    const context: EventContext = {
      emitter: caller,
      cycle: this.queue.cycle,
      subcycle: this.queue.subcycle,
    };

    // We copy the array to prevent issues when the callback modifies the array
    // - if the callback is ephemeral, it will be removed.
    // - the callback can add new listeners, and we don't want to:
    //   - call them in this iteration
    //   - iterate wrong because of the new elements
    for (const listener of subscribers.slice()) {
      const ret = listener(...args, context);
      if (ret instanceof Promise) {
        this.promises.push(ret);
      }
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
    when?: (args: EventCallbackArgs<B>) => boolean,
  ): void {
    if (!this.subscribers[event]) this.subscribers[event] = [];

    const wrappedCallback: EventCallback<B> = (...args: EventCallbackArgs<B>) => {
      // The event might want to run only if a condition is met (e.g. an argument
      // is the expected address).
      if (when && !when(args)) return;
      // This quickly raised alarm bells in my head, because it looks like there could
      // be a read-write race condition here.
      // - I get the event list
      // - somebody appends
      // - I filter from my event list
      // ... and now the other append is nowhere to be seen.
      // But after looking around, and making some tests, it seems like the JavaScript event
      // loop being single-threaded prevents this specific kind of race condition! Go JS!
      this.subscribers[event] = this.subscribers[event].filter((x) => x !== wrappedCallback);
      return callback.apply(this.modules[caller], args);
    };
    this.subscribers[event].unshift(wrappedCallback);
  }
  /**
   * once but in promise.
   */
  wait<E extends EventBaseName>(
    caller: ModuleID,
    event: EventName<E>,
    when?: (args: EventCallbackArgs<E>) => boolean,
  ): Promise<EventCallbackArgs<E>> {
    return new Promise((resolve) => {
      this.once(caller, event, (...args: EventCallbackArgs<E>) => resolve(args), when);
    });
  }

  emitAndWait<L extends EventBaseName, E extends EventBaseName>(
    caller: ModuleID,
    listened: EventName<L>,
    ...args: unknown[]
  ): Promise<EventCallbackArgs<L>> {
    let when: ((args: EventCallbackArgs<L>) => boolean) | undefined;
    let emitted: EventName<E>;
    let eventParams: EventParams<E>;

    if (args[0] instanceof Function) {
      when = args[0] as (args: EventCallbackArgs<L>) => boolean;
      emitted = args[1] as EventName<E>;
      eventParams = args.slice(2) as EventParams<E>;
    } else {
      emitted = args[0] as EventName<E>;
      eventParams = args.slice(1) as EventParams<E>;
    }

    const promise = this.wait(caller, listened, when);
    this.emit(caller, emitted, ...eventParams);
    return promise;
  }

  asSimulation({
    module,
    secure,
  }: { module?: ModuleID; secure?: boolean }): SimulationModuleInteraction {
    module = module ?? "*";

    const transceiver = secure
      ? this.asSecureTransceiver(module)
      : this.asInsecureTransceiver(module);

    // TODO: Add permissions to the cycle manager.

    return {
      ...transceiver,
      ...this.asCycleManager({ module, secure }),
    };
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

  asCycleManager({ module, secure }: { module?: ModuleID; secure?: boolean }): CycleManager {
    const ret: Partial<CycleManager> = {
      onCycle: this.onCycle.bind(this, module ?? "*"),
      onceCycle: this.onceCycle.bind(this, module ?? "*"),
      awaitCycle: this.awaitCycle.bind(this, module ?? "*"),
    };
    if (secure) {
      ret.performCycle = () => {
        if (secure) {
          if (module == null) throw new Error("Module must be specified to perform a cycle");
          const declaration = this.declarations[module];
          if (declaration == null)
            throw new Error(
              `[${module}] Module has no declaration but is trying to perform a cycle`,
            );
          if (declaration.cycles == null)
            throw new Error(
              `[${module}] Module has no cycle declaration but is trying to perform a cycle`,
            );
          if (!declaration.cycles.initiator)
            throw new Error(
              `[${module}] Module is not a cycle initiator but is trying to perform a cycle`,
            );
        }
        return this.performCycle();
      };
    } else {
      ret.performCycle = this.performCycle.bind(this);
    }

    return ret as CycleManager;
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
    actions: [] | ["emit" | "listen"] | ["emit", "listen"] | ["listen", "emit"],
    // biome-ignore lint/suspicious/noExplicitAny: <above>
    fun: (caller: ModuleID, event: EventName, ...args: any) => any,
    // biome-ignore lint/suspicious/noExplicitAny: <above>
  ): ((event: EventName, ...args: any) => any) => {
    if (actions.length === 0) {
      // biome-ignore lint/suspicious/noExplicitAny: <above>
      return (event: EventName, ...args: any) => fun.bind(this)(caller, event, ...args);
    } else if (actions.length === 1) {
      const listen = actions.includes("listen");
      if (listen) {
        // biome-ignore lint/suspicious/noExplicitAny: <above>
        return (event: EventName, ...args: any) => {
          this.permissionsCheckListen(caller, event);
          return fun.bind(this)(caller, event, ...args);
        };
      } else {
        // biome-ignore lint/suspicious/noExplicitAny: <above>
        return (event: EventName, ...args: any) => {
          this.permissionsCheckEmit(caller, event);
          return fun.bind(this)(caller, event, ...args);
        };
      }
    } else {
      // This is a special case, as we need to get the name of the event being
      // emitted and listened to.
      // biome-ignore lint/suspicious/noExplicitAny: <above>
      return (listened: EventName, ...args: any) => {
        const emitted = args[0] instanceof Function ? args[1] : args[0];
        this.permissionsCheckListen(caller, listened);
        this.permissionsCheckEmit(caller, emitted);
        return fun.bind(this)(caller, listened, ...args);
      };
    }
  };

  permissionsCheckEmit(caller: string, event: EventName): void {
    if (this.declarations[caller] == null) throw new Error(`[${caller}] Module has no declaration`);
    const providedMap = this.declarations[caller].providedMap;
    if (providedMap == null) throw new Error(`[${caller}] Module has no event declaration`);
    if (!providedMap.has(event)) throw new Error(`[${caller}] Cannot emit event ${event}.`);
  }
  permissionsCheckListen(caller: string, event: EventName): void {
    if (this.declarations[caller] == null) throw new Error(`[${caller}] Module has no declaration`);
    const evtDeclaration = this.declarations[caller].events;
    if (evtDeclaration == null) throw new Error(`[${caller}] Module has no event declaration`);
    if (
      !(event in evtDeclaration.required) &&
      (!evtDeclaration.optional || !(event in evtDeclaration.optional))
    )
      throw new Error(`[${caller}] Cannot listen to event ${event}.`);
  }
}

export default Simulator;
