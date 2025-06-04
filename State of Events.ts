import type {
  EventNames,
  EventCallback,
  ListenerPriority,
  ModuleID,
  EventParams,
  EventCallbackArgs,
  EventDeclaration,
  EventContext,
} from "./src/types/event";
import type { IModule, ModuleConstructor } from "./src/types/module";
import type { SimulatorConfig } from "./src/types/config";
import { PriorityQueue } from "./src/general/priority";

interface TypedEventTransceiver {
  /**
   * Emit an event, calling all listeners for the event, in the order specified
   * by their priority.
   * @param event The event name to emit.
   * @param emitter The ID of the emitter of the event.
   * @param receivers The ID of the receiver(s) of the event, or an empty array
   * if the event is broadcasted.
   * @param args The event parameters.
   */
  emit<E extends EventNames>(event: E, ...args: EventParams<E>): void;
  /**
   * Add a permanent listener for an event, that will be called every time the
   * event is emitted.
   * @param event The event name to listen for.
   * @param listener The callback function to call when the event is emitted (
   * the arguments to the callback function are the event parameters).
   * @param subtickPriority The subtick priority of the listener. The tick
   * priority is not customizable for permanent listeners (they are called every
   * tick).
   */
  on<E extends EventNames>(
    event: E,
    listener: EventCallback<E>,
    listenerPriority?: ListenerPriority,
  ): void;
  /**
   * Add a transient listener for an event, that will be called once.
   * The exact moment it will be called depends on the tick priority (which
   * event invocation it will be called in) and the subtick priority (which
   * order it will be called in within the tick).
   * @param event The event name to listen for.
   * @param listener The callback function to call when the event is emitted (
   * the arguments to the callback function are the event parameters).
   * @param listenerPriority The tick and subtick priority of the listener, if
   * not provided, the listener will be called in the next tick, in subtick
   * order 0.
   */
  once<E extends EventNames>(
    event: E,
    listener: EventCallback<E>,
    listenerPriority?: ListenerPriority,
  ): void;
  /**
   * Await an event, returning a promise that, when resolved, returns the event
   * parameters.
   * The promise will be resolved depending on the tick priority (which event
   * invocation it will be called in) and the subtick priority (which order it
   * will be called in within the tick).
   * @param event The event name to wait for.
   * @param listenerPriority The tick and subtick priority of the listener, if
   * not provided, the listener will be called in the next available tick, in
   * subtick order 0.
   */
  wait<E extends EventNames>(
    event: E,
    listenerPriority?: ListenerPriority,
  ): Promise<EventParams<E>>;
  /**
   * Emit an event, and wait for another event to be emitted. The returned
   * promise will be resolved with the parameters of the emitted event.
   * The listener priority will be the next tick, in subtick order 0.
   * @param listenedEvent The event name to wait for.
   * @param emittedEvent The event name to emit.
   * @param receivers The ID of the receiver(s) of the event, or an empty array
   * if the event is broadcasted.
   * @param args The event parameters.
   */
  emitAndWait<L extends EventNames, E extends EventNames>(
    listenedEvent: L,
    emittedEvent: E,
    ...args: EventParams<E>
  ): Promise<EventCallbackArgs<L>>;
  /**
   * Emit an event, and wait for another event to be emitted. The returned
   * promise will be resolved with the parameters of the emitted event.
   * The listened event's priority can be customized through the listenerPriority
   * parameter.
   * @param listenedEvent The event name to wait for.
   * @param listenerPriority The tick and subtick priority of the listened event.
   * @param receivers The ID of the receiver(s) of the event, or an empty array
   * if the event is broadcasted.
   * @param emittedEvent The event name to emit.
   * @param args The event parameters.
   */
  emitAndWait<L extends EventNames, E extends EventNames>(
    listenedEvent: L,
    listenerPriority: ListenerPriority,
    emittedEvent: E,
    ...args: EventParams<E>
  ): Promise<EventCallbackArgs<L>>;
}

class M6809Simulator {
  modules: Record<string, IModule> = {};
  event_declarations: Record<string, EventDeclaration> = {};

  events: Record<string, EventQueue> = {};

  constructor(config: SimulatorConfig, modules: ModuleConstructor[]) {
    /// ...

    for (let i = 0; i < config.modules.length; i++) {
      const module = new Module("moduleId", {}, {});
      const eventDeclaration = module.getEventDeclaration();
      // add module to this.modules, and eventDeclaration to this.event_declarations
    }

    // Check that the system is complete (all required events are provided)

    // Add listeners for all events in the EventDeclarations
  }

  once<E extends EventNames>(
    event: E,
    callback: EventCallback<E>,
    listenerPriority?: { order?: number; tick?: number; tickOffset?: number },
  ): void {
    this.events[event] ??= new EventQueue();

    const queue = this.events[event];

    // Calculate the tick and order based on the listenerPriority.
    const tick =
      listenerPriority?.tick ?? this.events[event].ticks + (listenerPriority?.tickOffset ?? 0);
    const order = listenerPriority?.order ?? 0;

    this.events[event].enqueue(callback, { tick, order });
  }

  emit<E extends EventNames>(event: E, ...args: EventParams<E>) {
    // If there are no listeners for this event, do nothing.
    if (!this.events[event]) return;

    // We're emitting an event, so we increment the index of the event queue (all the
    // new listeners will be added to the index following this one).
    this.events[event].incrementTick();

    while (!this.events[event].hasFinishedTick()) {
      const callback = this.events[event].dequeue();
      if (!callback) {
        throw new Error("[MC6809] callback for listener is undefined");
      }
      callback(...args);
    }
  }
}

type EventQueuePriority = {
  // The tick when the event should be executed (starting on 1).
  tick: number;
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

  cmp = (a, b) => a.priority.tick - b.priority.tick || a.priority.order - b.priority.order;

  constructor() {
    this.queue = new PriorityQueue(this.cmp);
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
    return this.queue.peek()!.priority.tick > this.ticks;
  }
  dequeue() {
    return this.queue.dequeue()?.callback;
  }
  debugView() {
    const sorted = this.queue._heap.sort(this.cmp);
    return sorted.reduce(
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      (acc: Map<string, EventCallback<any>[]>, el) => {
        const str = `${el.priority.tick}|${el.priority.order}`;
        if (!acc.has(str)) acc.set(str, []);
        acc.get(str)!.push(el.callback);
        return acc;
      },
      new Map(),
    );
  }

  incrementTick() {
    this.ticks++;
  }
}

// Ejemplo
const sim = new M6809Simulator(config, modulos);
sim.once(
  "test",
  (data) => {
    console.log(`received test with data ${data.toString(16)}`); // received test with data 1234
  },
  { tickOffset: 3 },
);

sim.emit("test", 0x1234);
sim.emit("test", 0x1234);
sim.emit("test", 0x1234);
