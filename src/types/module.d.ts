import type { EventDeclaration } from "./event";
import type { ISimulator } from "../types/simulator";

export interface IModule {
  getEventDeclaration(): EventDeclaration;
}

export type ModuleConstructor = {
  new (id: string, config: Record<string, unknown> | undefined, simulator: ISimulator): IModule;
};
