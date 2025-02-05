import type { Registers } from "../m6809/util/cpu_parts.js";

export interface EventMap {
  "memory:read": [address: number];
  "memory:write": [address: number, data: number];
  "memory:read:result": [address: number, data: number];
  "memory:write:result": [address: number, data: number];

  // GUI events.
  "gui:panel_created": [id: string, panel: HTMLElement];

  // System syncronisation events. These act as a barrier.
  "system:load_finish": [];

  // The hardware reset signal.
  "signal:reset": [];

  // Clock events.
  "clock:cycle_start": [];

  // CPU events
  "cpu:instruction_finish": [];
  "cpu:registers_update": [registers: Registers];
  "cpu:register_update": [register: string, value: number];
  "cpu:fail": [];
  "cpu:reset_finish": [];

  // UI events.
  "ui:clock:pause": [];
  "ui:clock:start": [];
  "ui:clock:step_cycle": [];
  "ui:clock:step_instruction": [];
  "ui:clock:fast_reset": [];
  "ui:memory:read": [address: number];
  "ui:memory:read:result": [address: number, data: number];
  "ui:memory:write": [address: number, data: number];
  "ui:memory:write:result": [address: number, data: number];
  "ui:memory:bulk:write": [data: Uint8Array];
  "ui:memory:bulk:write:result": [data: Uint8Array];
  // Add more events here.
}

// Extract the parameters from the event map, but also allow any array of parameters,
// for events that are not defined in the map. This allows more flexibility while
// extending the event system.
// NOTE: This works, but it doesn't autocomplete nicely. So I'm keeping it commented
// for now.
//type EventNames = keyof EventMap | string;
//export type EventParams<E extends EventNames> = E extends keyof EventMap ? EventMap[E] : any[];
export type EventNames = keyof EventMap;
export type EventParams<E extends EventNames> = EventMap[E];
type EventCallback<E extends EventNames> = (...args: EventParams<E>) => void;

export type SubtickPriority = { order?: number };
export type TickPriority =
  | { index: number; indexOffset?: never }
  | { index?: never; indexOffset: number }
  | { index?: never; indexOffset?: never };
/**
 * Priority object for listeners, with the following properties:
 * - order: The order within an index, lower is higher (default: 0)
 * - index: The index of the listener in the list (default: next available index)
 * - indexOffset: The offset to apply to the next available index, must be
 *   positive (default: 0)
 * Only one of index or indexOffset should be provided, if both are provided,
 * index will be used.
 */
export type ListenerPriority = SubtickPriority & TickPriority;

// Typed event emitter interface.
export interface TypedEventTransceiver {
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
   * Emit an event, calling all listeners for the event, in the order specified
   * by their priority.
   * @param event The event name to emit.
   * @param args The event parameters.
   */
  emit<E extends EventNames>(event: E, ...args: EventParams<E>): void;

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

  // TODO: add waitAny, waitAll?
  // Emits an event, and waits for another
  // Maybe also change the argument order??
  // TODO: add listenerPriority to emitAndWait as well

  /**
   * Emit an event, and wait for another event to be emitted. The returned
   * promise will be resolved with the parameters of the emitted event.
   * The listener priority will be the next tick, in subtick order 0.
   * @param listenedEvent The event name to wait for.
   * @param emittedEvent The event name to emit.
   * @param args The event parameters.
   */
  emitAndWait<L extends EventNames, E extends EventNames>(
    listenedEvent: L,
    emittedEvent: E,
    ...args: EventParams<E>
  ): Promise<EventParams<L>>;
  /**
   * Emit an event, and wait for another event to be emitted. The returned
   * promise will be resolved with the parameters of the emitted event.
   * The listened event's priority can be customized through the listenerPriority
   * parameter.
   * @param listenedEvent The event name to wait for.
   * @param listenerPriority The tick and subtick priority of the listened event.
   * @param emittedEvent The event name to emit.
   * @param args The event parameters.
   */
  emitAndWait<L extends EventNames, E extends EventNames>(
    listenedEvent: L,
    listenerPriority: ListenerPriority,
    emittedEvent: E,
    ...args: EventParams<E>
  ): Promise<EventParams<L>>;
}

// The event declaration type, which specifies the events that a module provides,
// requires, and optionally requires.
export type EventDeclaration = {
  provided: EventNames[];
  // The required and optional events are specified as an object, where the key is
  // the event name, and the value is the callback function for the event or an array
  // containing the callback function and the order.
  required: { [E in EventNames]?: [EventCallback<E>, number] | EventCallback<E> | null };
  optional?: { [E in EventNames]?: [EventCallback<E>, number] | EventCallback<E> | null };
};
