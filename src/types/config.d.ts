export type SimulatorConfig = {
  url: string;
  modules: ModuleConfig[];
};

export type ModuleConfig = {
  // Unique identifier for the module.
  id: string;
  // The url to load the module from.
  url: string;
  // The css files to load with the module.
  css?: string[];
  // The module config.
  config?: Record<string, unknown>;
};

export type Config = {
  simulator: SimulatorConfig;
};
