import type { EventDeclaration, TypedEventTransceiver } from "./event";

export interface IModule {
  getEventDeclaration(): EventDeclaration;
}

export type ModuleConstructor = {
  new (
    id: string,
    config: Record<string, unknown> | undefined,
    eventTransceiver: TypedEventTransceiver,
  ): IModule;
};
