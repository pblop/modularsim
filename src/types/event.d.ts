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

  // UI events.
  "ui:clock:pause": [];
  "ui:clock:start": [];
  "ui:clock:step_cycle": [];
  "ui:clock:step_instruction": [];
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

/**
 * Priority object for listeners, with the following properties:
 * - order: The order within an index, lower is higher (default: 0)
 * - index: The index of the listener in the list (default: next available index)
 * - indexOffset: The offset to apply to the next available index, must be
 *   positive (default: 0)
 * Only one of index or indexOffset should be provided, if both are provided,
 * index will be used.
 */
export type ListenerPriority = {
  order?: number;
} & (
  | { index: number; indexOffset?: never }
  | { index?: never; indexOffset: number }
  | { index?: never; indexOffset?: never }
);

// Typed event emitter interface.
export interface TypedEventTransceiver {
  on<E extends EventNames>(
    event: E,
    listener: EventCallback<E>,
    listenerPriority?: ListenerPriority,
  ): void;
  emit<E extends EventNames>(event: E, ...args: EventParams<E>): void;

  once<E extends EventNames>(
    event: E,
    listener: EventCallback<E>,
    listenerPriority?: ListenerPriority,
  ): void;
  wait<E extends EventNames>(
    event: E,
    listenerPriority?: ListenerPriority,
  ): Promise<EventParams<E>>;
  // TODO: add waitAny, waitAll?
  // TODO: add once, implement it wrapping on
  //       reimplement wait, wrapping once
  // once<E extends EventNames>(event: E, listener: EventCallback<E>): void;
  // wait<E extends EventNames>(event: E): Promise<EventParams<E>>;
  // Emits an event, and waits for another
  // Maybe also change the argument order??
  // TODO: add listenerPriority to emitAndWait as well
  emitAndWait<E extends EventNames, F extends EventNames>(
    emittedEvent: E,
    event: F,
    ...args: EventParams<E>
  ): Promise<EventParams<F>>;
}

export type EventDeclaration = {
  provided: EventNames[];
  required: { [E in EventNames]?: EventCallback<E> };
  optional: { [E in EventNames]?: EventCallback<E> };
};
