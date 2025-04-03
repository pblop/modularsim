import type {
  EventBaseName,
  EventDeclarationListeners,
  EventName,
  EventParams,
} from "../types/event.js";
import type { SimulationModuleInteraction } from "../types/module.js";
import { joinEventName } from "./event.js";

/**
 * A function to convert the provided memory event list to a multiplexed format,
 * if a multiplexer is provided.
 * Useful for working with multiplexer-aware hardware device modules.
 * @param providedMemoryEvents The list of base memory events
 * (e.g. "memory:read") the module is interested in providing a multiplexed
 * version of.
 * @param multiplexer The name of the multiplexer to use. If not provided,
 * the provided events will be returned as-is.
 * @example
 * const providedMemoryEvents = ["memory:read", "memory:write"];
 * const multiplexer = "multiplexer1";
 * const multiplexedEvents = toMultiplexedProvideds(providedMemoryEvents, multiplexer);
 * // multiplexedEvents = ["memory:read/multiplexer1", "memory:write/multiplexer1"]
 * @returns The list of provided memory events where the event names are
 * multiplexed with the provided multiplexer name.
 */
export function toMultiplexedProvideds(
  providedMemoryEvents: EventBaseName[],
  multiplexer?: string,
) {
  return providedMemoryEvents.map(
    (event: EventBaseName): EventName => (multiplexer ? joinEventName(event, multiplexer) : event),
  );
}

/**
 * A function to convert the required (or optional) memory event object to a
 * multiplexed format, if a multiplexer is provided.
 * Useful for working with multiplexer-aware hardware device modules.
 * @param requiredMemoryEvents The object of required memory events
 * (e.g. { "memory:read": callback }) the module is interested in providing a
 * multiplexed version of.
 * @param multiplexer The name of the multiplexer to use. If not provided,
 * the provided events will be returned as-is.
 * @returns The object of required/optional memory events where the event names
 * are multiplexed with the provided multiplexer name.
 */
export function toMultiplexedListeners(
  requiredMemoryEvents: EventDeclarationListeners,
  multiplexer?: string,
) {
  return Object.fromEntries(
    Object.entries(requiredMemoryEvents).map(([event, callback]) => [
      multiplexer ? joinEventName(event as EventBaseName, multiplexer) : event,
      callback,
    ]),
  );
}

/**
 * A function that emits a multiplexed event if a multiplexer is provided.
 * Useful for working with multiplexer-aware hardware device modules.
 * @param simulation The simulation module interaction object
 * @param multiplexer The name of the multiplexer to use. If not provided, the event
 * will be emitted as-is.
 * @param baseEvent The base event name to emit (e.g. "signal:irq")
 * @param args The arguments to pass to the emit function.
 */
export function emitMultiplexedEvent<E extends EventBaseName>(
  simulation: SimulationModuleInteraction,
  multiplexer: string | undefined,
  baseEvent: E,
  ...args: EventParams<E>
) {
  if (multiplexer) {
    const multiplexedEvent = joinEventName(baseEvent, multiplexer);
    simulation.emit(multiplexedEvent, ...args);
  } else {
    simulation.emit(baseEvent, ...args);
  }
}

/**
 * Emits a multiplexed event on the current cycle, with a subcycle offset.
 * This is useful for "real" hardware devices that need to emit events at
 * specific times, such as memory modules.
 * @param simulation The simulation module interaction object
 * @param multiplexer The name of the multiplexer to use. If not provided, the event
 * will be emitted as-is.
 * @param subcycle The subcycle of the current cycle to emit the event on.
 * @param baseEvent The base event name to emit (e.g. "signal:irq")
 * @param args The arguments to pass to the emit function.
 */
export function emitTimedMultiplexedEvent<E extends EventBaseName>(
  simulation: SimulationModuleInteraction,
  multiplexer: string | undefined,
  subcycle: number,
  baseEvent: E,
  ...args: EventParams<E>
) {
  simulation.onceCycle(() => emitMultiplexedEvent(simulation, multiplexer, baseEvent, ...args), {
    offset: 0,
    subcycle: subcycle,
  });
}
