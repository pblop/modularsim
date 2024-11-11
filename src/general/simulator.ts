import type { SimulatorConfig } from "../types/config.js";
import type { ModuleConstructor } from "./module.js";
import type { TypedEventEmitter } from "../types/event.js";

export interface ISimulator extends TypedEventEmitter {}

export type SimulatorConstructor = {
	new (config: SimulatorConfig, modules: ModuleConstructor[]): ISimulator;
};
