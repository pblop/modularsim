import type { CycleDeclaration } from "./cycles";
import type { EventDeclaration, TypedEventTransceiver } from "./event";

export type ModuleDeclaration = {
  events: EventDeclaration;
  cycles: CycleDeclaration;
};

export interface IModule {
  /**
   * This field is not static, and as such, will be called after the module is
   * initialized through the constructor. That means that the module can use its
   * variables and config to set up different event listeners.
   * It will also only be called once, after the module is initialized, at the
   * start of the simulation.
   */
  getModuleDeclaration(): ModuleDeclaration;
}

export type ModuleConstructor = {
  new (
    id: string,
    config: Record<string, unknown> | undefined,
    eventTransceiver: TypedEventTransceiver,
  ): IModule;
};
