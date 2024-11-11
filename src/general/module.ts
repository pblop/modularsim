import type { EventDeclaration } from "../types/event";
import type { ISimulator } from "./simulator";

export interface IModule {
	getEventDeclaration(): EventDeclaration;
}

export type ModuleConstructor = {
	new (config: Record<string, unknown> | undefined, simulator: ISimulator): IModule;
};
