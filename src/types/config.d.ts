export type SimulatorConfig = {
  name: string;
  url: string;
  modules: ModuleConfig[];
};

type ModuleConfig = {
  name: string;
  type: string;
  url: string;
  config?: any;
};

type ExtensionConfig = {
  name: string;
  url: string;
  config?: any;
};

type ProgramConfig = {
  name: string;
  url: string;
};

type Config = {
  simulator: SimulatorConfig;
  views: ExtensionConfig[];
  programs: ProgramConfig[];
};

export default Config;
