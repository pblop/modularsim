import type { SimulatorConfig } from "./config.js";

export interface ISimulator {
  something(): void;
}
export abstract class SimulatorBase implements ISimulator {
  new(config: SimulatorConfig): ISimulator;

  something(): void;
}
