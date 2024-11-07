import { EventDeclaration } from "../types/event";
import { ISimulator } from "./simulator";

export interface IModule {}

export abstract class ModuleBase implements IModule {
  constructor(config: any | undefined, simulator: ISimulator) {}

  abstract getEventDeclaration(): EventDeclaration;
}

export type ModuleConstructor = {
  new (config: any | undefined, simulator: ISimulator): ModuleBase;
};
