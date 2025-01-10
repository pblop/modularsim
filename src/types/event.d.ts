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

  // UI events.
  "ui:clock:pause": [];
  "ui:clock:start": [];
  "ui:clock:step_cycle": [];
  "ui:clock:step_instruction": [];
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

// Typed event emitter interface.
export interface TypedEventTransceiver {
  on<E extends EventNames>(event: E, listener: EventCallback<E>): void;
  emit<E extends EventNames>(event: E, ...args: EventParams<E>): void;

  // TODO: add once, implement it wrapping on
  //       reimplement wait, wrapping once
  // once<E extends EventNames>(event: E, listener: EventCallback<E>): void;
  // wait<E extends EventNames>(event: E): Promise<EventParams<E>>;
  // Emits an event, and waits for another
  // Maybe also change the argument order??
  emitAndWait<E extends EventNames>(
    emittedEvent: E,
    event: E,
    ...args: EventParams<E>
  ): Promise<EventParams<E>>;
}

export type EventDeclaration = {
  provided: EventNames[];
  required: { [E in EventNames]?: EventCallback<E> };
  optional: { [E in EventNames]?: EventCallback<E> };
};
