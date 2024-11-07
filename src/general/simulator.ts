import type { SimulatorConfig } from "../types/config.js";
import { ModuleConstructor } from "./module.js";
import { EventNames, EventParams, EventCallback, TypedEventEmitter } from "../types/event.js";

export interface ISimulator extends TypedEventEmitter {}

export abstract class SimulatorBase implements ISimulator {
  constructor(config: SimulatorConfig, modules: ModuleConstructor[]) {}

  // Typed event emitter methods.
  abstract on<E extends EventNames>(event: E, listener: EventCallback<E>): void;
  abstract emit<E extends EventNames>(event: E, ...args: EventParams<E>): void;
}

export type SimulatorConstructor = {
  new (config: SimulatorConfig, modules: ModuleConstructor[]): SimulatorBase;
};
