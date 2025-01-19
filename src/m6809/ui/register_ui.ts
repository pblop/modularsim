import type { IModule } from "../../types/module.js";
import type { ISimulator } from "../../types/simulator.js";
import type { EventDeclaration, TypedEventTransceiver } from "../../types/event.js";
import { element, isNumber, parseNumber } from "../../utils.js";

type RegisterInfoConfig = {
  size: number;
  pointer?: boolean;
  mirror?: {
    register: string;
    mask: number;
  };
};
type RegisterUIConfig = {
  registers: Record<string, RegisterInfoConfig>;
};

function validateRegisterInfo(registerInfo: Record<string, unknown>): RegisterInfoConfig {
  if (typeof registerInfo.size !== "number")
    throw new Error("[RegisterUI] Register size must be a number");
  if (registerInfo.pointer && typeof registerInfo.pointer !== "boolean")
    throw new Error("[RegisterUI] Register pointer must be a boolean");
  if (registerInfo.mirror && typeof registerInfo.mirror === "object") {
    if (!("register" in registerInfo.mirror) || typeof registerInfo.mirror.register !== "string")
      throw new Error("[RegisterUI] Mirror register must be a string");
    if (!("mask" in registerInfo.mirror) || !isNumber(registerInfo.mirror.mask))
      throw new Error("[RegisterUI] Mirror mask must be a number (or a hex representation)");
    if (typeof registerInfo.mirror.mask === "string")
      registerInfo.mirror.mask = parseNumber(registerInfo.mirror.mask);
  }

  return registerInfo as RegisterInfoConfig;
}

function validateRegisterUIConfig(config: Record<string, unknown>): RegisterUIConfig {
  if (!config.registers) throw new Error("[RegisterUI] No registers provided");

  config.registers = Object.fromEntries(
    Object.entries(config.registers).map(([name, registerInfo]) => [
      name,
      validateRegisterInfo(registerInfo),
    ]),
  );

  return config as RegisterUIConfig;
}

function indexOfLsb(mask: number): number {
  let count = 0;
  // I shift a 1 bit to the left until I find the first 1 in the mask, that's
  // the number of bits I need to shift to the right to get the first 1 in the
  // mask to the least significant bit.
  while ((mask & (1 << count)) === 0) {
    count++;
  }
  return count;
}

class RegisterUI implements IModule {
  et: TypedEventTransceiver;
  id: string;

  readonly config: RegisterUIConfig;
  registerValues: Record<string, number> = {};

  panel?: HTMLElement;
  registerTable?: HTMLTableElement;

  getEventDeclaration(): EventDeclaration {
    return {
      provided: ["ui:memory:read"],
      required: {
        "gui:panel_created": this.onGuiPanelCreated,
        "cpu:register_update": this.onRegisterUpdate,
        // TODO: mem:read:result is only needed for the hover effect, maybe the
        // base module should be able to tell us if it's available, and we could
        // provide the hover effect only if it is.
        "ui:memory:read:result": () => {},
      },
      optional: {},
    };
  }

  constructor(
    id: string,
    config: Record<string, unknown> | undefined,
    eventTransceiver: TypedEventTransceiver,
  ) {
    // We use the simulator to emit/receive events.
    this.et = eventTransceiver;
    this.id = id;

    if (!config) throw new Error(`[${this.id}] No configuration provided`);
    this.config = validateRegisterUIConfig(config);

    console.log(`[${this.id}] Initializing module.`);
  }

  onRegisterUpdate = (register: string, value: number): void => {
    if (!this.panel) return;
    if (!this.registerTable) return;

    const cell = this.panel.querySelector(`.register-${register}`);
    if (!cell) return;

    this.registerValues[register] = value;
    cell.textContent = this.formatRegister(register, value);

    // NOTE: this could be optimized by keeping a list of mirrors for each register,
    // and the number of bits to shift, instead of iterating over all registers every time,
    // and calculating the number of bits to shift every time (which is constant for a mask).
    // But this is fine for now, since this is only done when a register is updated.

    // Update registers that mirror this one.
    const mirrors = Object.entries(this.config.registers).filter(
      ([_, { mirror }]) => mirror?.register === register,
    );

    for (const [name, { mirror }] of mirrors) {
      const mirroredCell = this.panel.querySelector(`.register-${name}`);
      if (!mirroredCell) throw new Error(`[${this.id}] Missing cell for register ${name}`);

      // biome-ignore lint/style/noNonNullAssertion: I've already checked for the mirror property's existence above.
      const mask = mirror!.mask;
      const mirroredValue = (value & mask) >> indexOfLsb(mask);
      this.registerValues[name] = mirroredValue;
      mirroredCell.textContent = this.formatRegister(name, mirroredValue);
    }
  };

  formatRegister(register: string, data: number): string {
    const numBytes = Math.ceil(this.config.registers[register].size / 8);
    return data.toString(16).padStart(numBytes * 2, "0");
  }

  onGuiPanelCreated = (panel_id: string, panel: HTMLElement): void => {
    if (this.id !== panel_id) return;
    console.log(`[${this.id}] obtained GUI panel`);

    this.panel = panel;
    this.panel.classList.add("register-ui");

    this.createRegisterUI();
  };

  generateTooltipFunction(register: string): (ev: MouseEvent) => Promise<void> {
    return async (ev: MouseEvent) => {
      if (!ev.target) return;

      const address = this.registerValues[register];
      if (address === undefined) return;

      const data = [];

      // TODO: This breaks if the address is the last one in memory (or close to it),
      // and we don't know the memory size.
      for (let offset = -4; offset < 5; offset++) {
        const readAddress = address + offset;
        if (readAddress < 0) continue;

        const [_, val] = await this.et.emitAndWait(
          "ui:memory:read",
          "ui:memory:read:result",
          readAddress,
        );
        data.push({ offset, val });
      }

      const row = [];
      for (const { offset, val } of data) {
        let str = val.toString(16).padStart(2, "0");
        if (offset === 0) {
          if (data[0].offset < 0) str = `<|${str}`;
          if (data[data.length - 1].offset > 0) str = `${str}|>`;
        }
        row.push(str);
      }

      (ev.target as HTMLTableCellElement).title = `${row.join(" ")}`;
    };
  }

  createRegisterUI(): void {
    if (!this.panel) return;

    this.registerTable = element("table", {
      properties: { className: "register-table" },
      children: [
        // Header row
        element("tr", {
          children: Object.entries(this.config.registers).map(([name, { pointer }]) =>
            element("th", {
              properties: {
                textContent: name,
                className: `${pointer ? "pointer-register" : ""}`,
                title: pointer ? "Pointer register" : undefined,
              },
            }),
          ),
        }),
        // Register values row
        element("tr", {
          children: Object.keys(this.config.registers).map((name) =>
            element("td", {
              properties: {
                className: `register-${name} ${this.config.registers[name].pointer ? "pointer-register-value" : ""}`,
                textContent: "unk.",
                onmouseenter: this.config.registers[name].pointer
                  ? this.generateTooltipFunction(name)
                  : undefined,
              },
            }),
          ),
        }),
      ],
    });

    this.panel.appendChild(this.registerTable);
  }
}

export default RegisterUI;
