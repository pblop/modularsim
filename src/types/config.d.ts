export type SimulatorConfig = {
  name: string;
  url: string;
  modules: ModuleConfig[];
};

export type ModuleConfig = {
  name: string;
  type: string;
  url: string;
  config?: Record<string, unknown>;
};

type ExtensionConfig = {
  name: string;
  url: string;
  config?: Record<string, unknown>;
};

type ProgramConfig = {
  name: string;
  url: string;
};

export type Config = {
  simulator: SimulatorConfig;
  views: ExtensionConfig[];
  programs: ProgramConfig[];
};
