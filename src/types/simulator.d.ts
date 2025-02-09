import type { SimulatorConfig } from "../types/config.js";
import type { ModuleConstructor } from "../types/module.js";
import type {} from "../types/event.js";

// Empty for now, but will (probably) be expanded later.
// biome-ignore lint/suspicious/noEmptyInterface: <above>
export interface ISimulator {}

export type SimulatorConstructor = {
  new (config: SimulatorConfig, modules: ModuleConstructor[]): ISimulator;
};
