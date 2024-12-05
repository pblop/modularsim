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
}

export type EventDeclaration = {
  provided: EventNames[];
  required: { [E in EventNames]?: EventCallback<E> };
  optional: { [E in EventNames]?: EventCallback<E> };
};
