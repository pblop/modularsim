import type { CpuAddressingData } from "../m6809/hardware/cpu.js";
import type { Registers } from "../m6809/util/cpu_parts.js";
import type { AddressingMode, InstructionData } from "../m6809/util/instructions.js";

export interface EventMap<AM extends AddressingMode = AddressingMode> {
  "memory:read": [address: number];
  "memory:write": [address: number, data: number];
  "memory:read:result": [address: number, data: number];
  "memory:write:result": [address: number, data: number];

  // GUI events.
  "gui:panel_created": [id: string, panel: HTMLElement, language: string];

  // Debugging events (most not used yet).
  "dbg:breakpoint_hit": [address: number];
  "dbg:breakpoint:remove": [address: number];
  "dbg:breakpoint:add": [address: number];
  "dbg:breakpoint:enable": [address: number];
  "dbg:breakpoint:disable": [address: number];
  "dbg:symbol:add": [symbol: string, address: number, type: "global"];
  "dbg:symbol:clear": [];

  "dbg:register_update": [register: string, value: number];

  // System syncronisation events. These act as a barrier.
  "system:load_finish": [];

  // The hardware reset signal.
  "signal:reset": [];
  "signal:nmi": [];
  "signal:irq": [];
  "signal:firq": [];

  // CPU events
  "cpu:instruction_begin": [pc: number];
  "cpu:instruction_fetched": [instruction: InstructionData];
  "cpu:instruction_decoded": [instruction: InstructionData<AM>, addressing: CpuAddressingData<AM>];
  "cpu:instruction_finish": [];

  "cpu:registers_update": [registers: Registers];
  "cpu:register_update": [register: string, value: number];
  "cpu:fail": [];
  "cpu:reset_finish": [];
  "cpu:function": [pc: number, registers: Registers];
  "cpu:function:result": [pc: number, newRegisters: Registers];

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

  "ui:breakpoint:add": [address: number];
  "ui:breakpoint:remove": [address: number];
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
 * - cycle: The cycle the event is being executed in.
 * - subcycle: The subcycle the event is being executed in.
 */
export type EventContext = { emitter: string; cycle: number; subcycle: number };
export type EventCallbackArgs<B extends EventBaseName> = [
  ...args: EventParams<B>,
  context: EventContext,
];
type EventCallback<B extends EventBaseName> = (
  ...args: EventCallbackArgs<B>
) => unknown | Promise<unknown>;

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
  on<B extends EventBaseName>(event: EventName<B>, listener: EventCallback<B>): void;
  /**
   * Emit an event, calling all listeners for the event, in the order specified
   * by their priority.
   * @param event The event name to emit.
   * @param emitter The ID of the emitter of the event.
   * @param args The event parameters.
   */
  emit<B extends EventBaseName>(event: EventName<B>, ...args: EventParams<B>): void;

  /**
   * Add a transient listener for an event, that will be called once.
   * The exact moment it will be called depends on the cycle priority (which
   * event invocation it will be called in) and the subcycle priority (which
   * order it will be called in within the cycle).
   * @param event The event name to listen for.
   * @param listener The callback function to call when the event is emitted (
   * the arguments to the callback function are the event parameters).
   */
  once<B extends EventBaseName>(
    event: EventName<B>,
    listener: EventCallback<B>,
    when?: (args: EventCallbackArgs<B>) => boolean,
  ): void;

  /**
   * Await an event, returning a promise that, when resolved, returns the event
   * parameters.
   * The promise will be resolved depending on the cycle priority (which event
   * invocation it will be called in) and the subcycle priority (which order it
   * will be called in within the cycle).
   * @param event The event name to wait for.
   */
  wait<B extends EventBaseName>(
    event: EventName<B>,
    when?: (args: EventCallbackArgs<B>) => boolean,
  ): Promise<EventParams<B>>;

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
  emitAndWait<L extends EventBaseName, E extends EventBaseName>(
    listenedEvent: EventName<L>,
    when: (args: EventCallbackArgs<L>) => boolean,
    emittedEvent: EventName<E>,
    ...args: EventParams<E>
  ): Promise<EventCallbackArgs<L>>;
  emitAndWait<L extends EventBaseName, E extends EventBaseName>(
    listenedEvent: EventName<L>,
    emittedEvent: EventName<E>,
    ...args: EventParams<E>
  ): Promise<EventCallbackArgs<L>>;
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
  provided: EventName[];
  required: EventDeclarationListeners;
  optional?: EventDeclarationListeners;
};
