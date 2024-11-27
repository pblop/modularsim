import type { EventDeclaration } from "./event";
import type { ISimulator } from "../types/simulator";

export interface IModule {
  getEventDeclaration(): EventDeclaration;
}

export type ModuleConstructor = {
  new (config: Record<string, unknown> | undefined, simulator: ISimulator): IModule;
};
