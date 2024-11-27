import type { SimulatorConfig } from "../types/config.js";
import type { ModuleConstructor } from "../types/module.js";
import type { TypedEventTransceiver } from "../types/event.js";

export interface ISimulator extends TypedEventTransceiver {}

export type SimulatorConstructor = {
  new (config: SimulatorConfig, modules: ModuleConstructor[]): ISimulator;
};
