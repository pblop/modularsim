import type { SimulatorConfig } from "../types/config.js";
import { ModuleConstructor } from "./module.js";

export interface ISimulator {}

export abstract class SimulatorBase implements ISimulator {
  constructor(config: SimulatorConfig, modules: ModuleConstructor[]) {}
}

export type SimulatorConstructor = {
  new (config: SimulatorConfig, modules: ModuleConstructor[]): SimulatorBase;
};
