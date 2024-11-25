export type SimulatorConfig = {
  url: string;
  modules: ModuleConfig[];
};

export type ModuleConfig = {
  // Unique identifier for the module.
  id: string;
  // The module type.
  type: string;
  // The url to load the module from.
  url: string;
  // The module config.
  config?: Record<string, unknown>;
  // Removed child modules for now.
  // // Child modules.
  // modules?: ModuleConfig[];
};

export type Config = {
  simulator: SimulatorConfig;
};
