import type { Registers } from "../m6809/util/cpu_parts.js";

export interface EventMap {
  "memory:read": [address: number];
  "memory:write": [address: number, data: number];
  "memory:read:result": [address: number, data: number];
  "memory:write:result": [address: number, data: number];

  // GUI events.
  "gui:panel_created": [id: string, panel: HTMLElement, language: string];

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
  "ui:memory:bulk:write": [address: number, data: Uint8Array];
  "ui:memory:bulk:write:result": [address: number, data: Uint8Array];
  // Add more events here.
}

// Extract the parameters from the event map, but also allow any array of parameters,
// for events that are not defined in the map. This allows more flexibility while
// extending the event system.
// NOTE: This works, but it doesn't autocomplete nicely. So I'm keeping it commented
// for now.
//type EventNames = keyof EventMap | string;
//export type EventParams<E extends EventNames> = E extends keyof EventMap ? EventMap[E] : any[];
export type EventBaseName = keyof EventMap;
export type EventGroup = string;
export type EventName<B extends EventBaseName = EventBaseName> = B | `${B}/${EventGroup}`;
export type EventParams<B extends EventBaseName> = EventMap[B];

/**
 * Contextual data about the event, with the following properties:
 * - emitter: The ID of the emitter of the event.
 * - cycle: The cycle of the event.
 */
export type EventContext = { emitter: string; cycle: number };
export type EventCallbackArgs<B extends EventBaseName> = [
  ...args: EventParams<B>,
  context: EventContext,
];
type EventCallback<B extends EventBaseName> = (...args: EventCallbackArgs<B>) => void;

type ModuleID = string | "*";

// Typed event emitter interface.
// Rename to: MessageOrchestrator
export interface TypedEventTransceiver {
  /**
   * Add a permanent listener for an event, that will be called every time the
   * event is emitted.
   * @param event The event name to listen for.
   * @param listener The callback function to call when the event is emitted (
   * the arguments to the callback function are the event parameters).
   */
  on<E extends EventBaseName>(event: E, listener: EventCallback<E>): void;
  /**
   * Emit an event, calling all listeners for the event, in the order specified
   * by their priority.
   * @param event The event name to emit.
   * @param emitter The ID of the emitter of the event.
   * @param args The event parameters.
   */
  emit<B extends EventBaseName, E extends EventName<B>>(event: E, ...args: EventParams<B>): void;

  /**
   * Add a transient listener for an event, that will be called once.
   * The exact moment it will be called depends on the cycle priority (which
   * event invocation it will be called in) and the subcycle priority (which
   * order it will be called in within the cycle).
   * @param event The event name to listen for.
   * @param listener The callback function to call when the event is emitted (
   * the arguments to the callback function are the event parameters).
   */
  once<B extends EventBaseName, E extends EventName<B>>(event: E, listener: EventCallback<B>): void;

  /**
   * Await an event, returning a promise that, when resolved, returns the event
   * parameters.
   * The promise will be resolved depending on the cycle priority (which event
   * invocation it will be called in) and the subcycle priority (which order it
   * will be called in within the cycle).
   * @param event The event name to wait for.
   */
  wait<B extends EventBaseName, E extends EventName<B>>(event: E): Promise<EventParams<B>>;

  // TODO: add waitAny, waitAll?
  // Emits an event, and waits for another
  // Maybe also change the argument order??
  // TODO: add listenerPriority to emitAndWait as well

  /**
   * Emit an event, and wait for another event to be emitted. The returned
   * promise will be resolved with the parameters of the emitted event.
   * The listener priority will be the next cycle, in subcycle order 0.
   * @param listenedEvent The event name to wait for.
   * @param emittedEvent The event name to emit.
   * @param args The event parameters.
   */
  emitAndWait<
    BListen extends EventBaseName,
    BEmit extends EventBaseName,
    Listen extends EventName<BListen>,
    Emit extends EventName<BEmit>,
  >(
    listenedEvent: Listen,
    emittedEvent: Emit,
    ...args: EventParams<BEmit>
  ): Promise<EventCallbackArgs<BListen>>;
}

// The event declaration type, which specifies the events that a module provides,
// requires, and optionally requires.
/**
 * The event listeners are specified as an object, where the key is the event name,
 * and the value is either:
 * - an array containing the callback function and the subcycle priority
 * - the callback function for the event (interpreted as subcycle priority 0)
 */
export type EventDeclarationListeners = Partial<{
  [B in EventBaseName]: {
    [K in EventName<B>]?: EventCallback<B> | null;
  }[EventName<B>];
}>;
export type EventDeclaration = {
  provided: EventBaseName[];
  required: EventDeclarationListeners;
  optional?: EventDeclarationListeners;
};
