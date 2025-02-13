export type CycleCallback = (cycle: number) => void;

/**
 * Subcycle priority for listeners, with the following properties:
 * - order: The order within a cycle, lower is higher (default: 0)
 */
export type SubcyclePriority = { order?: number };
/**
 * Cycle priority for listeners, with the following properties:
 * - cycle: The cycle of the listener in the list (default: next available cycle)
 * - offset: The offset to apply to the next cycle, must be positive (default: 0)
 * Only one of cycle or offset should be provided, if both are provided,
 * cycle will be used.
 */
export type CyclePriority =
  | { cycle: number; offset?: never }
  | { cycle?: never; offset: number }
  | { cycle?: never; offset?: never };
export type ListenerPriority = SubcyclePriority & CyclePriority;

/**
 * The listener priority for the final listener, which is obtained from the
 * ListnerPriority, by using defaults and/or calculating its fields.
 */
export type FinalListenerPriority = { cycle: number; order: number };

export interface CycleManager {
  performCycle(): void;

  onCycle(callback: CycleCallback, priority?: SubcyclePriority): void;
  onceCycle(callback: CycleCallback, priority?: ListenerPriority): void;
  awaitCycle(priority?: ListenerPriority): Promise<number>;
}
