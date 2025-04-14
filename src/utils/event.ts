import type { EventBaseName, EventGroup, EventName } from "../types/event.js";

/**
 * Separate the base name and group of an event name.
 * @param eventName The event name to separate.
 * @returns A tuple with the base name and group of the event.
 */
export function separateEventName<E extends EventBaseName>(
  eventName: EventName<E>,
): [EventBaseName, EventGroup] {
  const parts = eventName.split("/");
  return [parts[0] as EventBaseName, parts.length > 1 ? (parts[1] as EventGroup) : ""];
}
/**
 * Join a base name and group into an event name.
 * @param base The base name of the event.
 * @param group The group of the event (optional).
 * @returns The full event name.
 */
export function joinEventName<E extends EventBaseName>(
  base: E,
  group: EventGroup = "",
): EventName<E> {
  if (group === "") return base;

  return `${base}/${group}`;
}
