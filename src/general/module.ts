export interface IModule {}

export abstract class ModuleBase implements IModule {
  constructor(config?: any) {}
}

export type ModuleConstructor = {
  new (config?: any): ModuleBase;
};
