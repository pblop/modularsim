import { isNumber, parseNumber } from "../../../utils/config.js";
import { element, rewrittableTableElement } from "../../../utils/html.js";
import { createLanguageStrings } from "../../../utils/lang.js";
import { UpdateQueue } from "../../../utils/updatequeue.js";
import type { EventDeclaration, TypedEventTransceiver } from "../../../types/event.js";
import type { IModule, ModuleDeclaration } from "../../../types/module.js";
import type { ISimulator } from "../../../types/simulator.js";

type RegisterInfoConfig = {
  bits: number;
  pointer?: boolean;
  mirror?: {
    register: string;
    mask: number;
  };
  // A breakdown of the register into smaller flags, e.g. for the status register.
  // It should be an array with the name of the flags, in order of significance
  // (most significant first).
  flags?: string[];
};
type RegisterUIConfig = {
  registers: Record<string, RegisterInfoConfig>;
};

function validateRegisterInfo(registerInfo: Record<string, unknown>): RegisterInfoConfig {
  if (!isNumber(registerInfo.bits))
    throw new Error(
      "[RegisterUI] Register bits must be a number (or a string representation thereof)",
    );
  if (typeof registerInfo.bits === "string") registerInfo.bits = parseNumber(registerInfo.bits);

  if (registerInfo.pointer && typeof registerInfo.pointer !== "boolean")
    throw new Error("[RegisterUI] Register pointer must be a boolean");
  if (registerInfo.mirror) {
    if (typeof registerInfo.mirror !== "object")
      throw new Error("[RegisterUI] Mirror must be an object");
    if (!("register" in registerInfo.mirror) || typeof registerInfo.mirror.register !== "string")
      throw new Error("[RegisterUI] Mirror register must be a string");

    if (!("mask" in registerInfo.mirror) || !isNumber(registerInfo.mirror.mask))
      throw new Error(
        "[RegisterUI] Mirror mask must be a number (or a string representation thereof)",
      );
    if (typeof registerInfo.mirror.mask === "string")
      registerInfo.mirror.mask = parseNumber(registerInfo.mirror.mask);
  }

  if (registerInfo.breakdown) {
    if (!Array.isArray(registerInfo.breakdown))
      throw new Error("[RegisterUI] Register breakdown must be an array");
    if (registerInfo.breakdown.length !== registerInfo.bits)
      throw new Error(
        "[RegisterUI] Register breakdown length must match the number of bits in the register",
      );
    if (registerInfo.breakdown.some((part) => typeof part !== "string"))
      throw new Error("[RegisterUI] Register flag names must be strings");
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

const RegisterUIStrings = createLanguageStrings({
  en: {
    pointerRegister: "Pointer register",
    onlyHex: "Only hex values of the same length as the register are allowed.",
    uneditableMirror: "This register is a mirror of another register, and cannot be edited.",
    uneditable: "Registers are uneditable while the CPU is executing an instruction.",
    initialUneditable: "The register cannot be edited until the CPU has been initialized.",
    flags: "Flags: {flags}",
    invalidFlag: "Invalid flag: {flag}",
    moreFlagsThanExpected: "Used more flags than expected",
    invalidOrWrongNumberOfFlags: "Invalid flag or wrong number of flags",
  },
  es: {
    pointerRegister: "Registro apuntador",
    onlyHex: "Sólo se permiten valores hexadecimales de la longitud del registro.",
    uneditableMirror: "Este registro es un espejismo de otro registro, y no se puede editar.",
    uneditable:
      "Los registros no se pueden editar mientras la CPU esté ejecutando una instrucción.",
    initialUneditable: "No se puede editar el registro hasta que la CPU se haya inicializado.",
    flags: "Banderas: {flags}",
    invalidFlag: "Bandera inválida: {flag}",
    moreFlagsThanExpected: "Usadas más banderas de las esperadas",
    invalidOrWrongNumberOfFlags: "Bandera inválida o número incorrecto de banderas",
  },
});

class RegisterUI implements IModule {
  et: TypedEventTransceiver;
  id: string;

  readonly config: RegisterUIConfig;
  registerValues: Record<string, number> = {};

  panel?: HTMLElement;
  registerTable?: HTMLTableElement;

  language!: string;
  localeStrings!: typeof RegisterUIStrings.en;

  updateQueue: UpdateQueue;
  updatedRegisters: Set<string>;
  editableRegisters: boolean;

  getModuleDeclaration(): ModuleDeclaration {
    return {
      events: {
        provided: ["ui:memory:read", "dbg:register_update"],
        required: {
          "gui:panel_created": this.onGuiPanelCreated,
          "cpu:register_update": this.onRegisterUpdate,
          // TODO: mem:read:result is only needed for the hover effect, maybe the
          // base module should be able to tell us if it's available, and we could
          // provide the hover effect only if it is.
          "ui:memory:read:result": null,
        },
        optional: {
          "cpu:instruction_begin": this.disableRegisterEditing,
          "cpu:instruction_finish": this.enableRegisterEditing,
          "cpu:reset_finish": this.enableRegisterEditing,
        },
      },
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

    this.setLanguage("en");

    this.updateQueue = new UpdateQueue(this.refreshUI);
    this.updatedRegisters = new Set();
    this.editableRegisters = false;

    console.log(`[${this.id}] Initializing module.`);
  }

  setLanguage(language: string): void {
    this.language = language;
    this.localeStrings = RegisterUIStrings[this.language] || RegisterUIStrings.en;
  }

  onRegisterUpdate = (register: string, value: number): void => {
    if (!this.panel) return;
    if (!this.registerTable) return;

    const cell = this.panel.querySelector(`.register-${register}`);
    if (!cell) return;

    this.registerValues[register] = value;

    this.updatedRegisters.add(register);
    this.updateQueue.queueUpdate();
  };
  disableRegisterEditing = (): void => {
    if (!this.panel) return;
    if (!this.registerTable) return;

    this.editableRegisters = false;
    this.updateQueue.queueUpdate();
  };
  enableRegisterEditing = (): void => {
    if (!this.panel) return;
    if (!this.registerTable) return;

    this.editableRegisters = true;
    this.updateQueue.queueUpdate();
  };

  refreshUI = () => {
    if (!this.panel) return;

    for (const register of this.updatedRegisters) {
      this.updateRegisterCell(register);
    }

    this.markRegistersAs(this.editableRegisters);
  };

  markRegistersAs(editable: boolean): void {
    if (!this.panel) return;
    if (!this.registerTable) return;

    for (const register of Object.keys(this.config.registers)) {
      const cell = this.panel.querySelector(`.register-${register}`);
      if (!cell) continue;

      if (!editable) {
        cell.classList.add("uneditable");
        cell.classList.remove("editable");
      } else if (this.config.registers[register].mirror === undefined) {
        cell.classList.remove("uneditable");
        cell.classList.add("editable");
      }
    }
  }

  updateRegisterCell(register: string): void {
    if (!this.panel) return;
    this.updatedRegisters.delete(register);

    const cell = this.panel.querySelector(`.register-${register}`);
    if (!cell) return;

    const value = this.registerValues[register];

    // Display flags if they exist, otherwise just display the value.
    const flags = this.config.registers[register].flags;
    if (flags) {
      const flagValues = flags
        .map((flag, i) => ((value & (1 << (flags.length - i - 1))) !== 0 ? flag : "_"))
        .join("");
      cell.textContent = flagValues || "none";
    } else {
      cell.textContent = this.formatRegister(register, value);
    }

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

      const mask = mirror!.mask;
      const mirroredValue = (value & mask) >> indexOfLsb(mask);
      this.registerValues[name] = mirroredValue;
      mirroredCell.textContent = this.formatRegister(name, mirroredValue);
    }
  }

  formatRegister(register: string, data: number): string {
    const numBytes = Math.ceil(this.config.registers[register].bits / 8);
    return data.toString(16).padStart(numBytes * 2, "0");
  }

  onGuiPanelCreated = (panel_id: string, panel: HTMLElement, language: string): void => {
    if (this.id !== panel_id) return;
    console.log(`[${this.id}] obtained GUI panel`);

    this.panel = panel;
    this.panel.classList.add("register-ui");

    this.setLanguage(language);

    this.createRegisterUI();
  };

  generateTooltipFunction(register: string): (ev: MouseEvent) => Promise<void> {
    return async (ev: MouseEvent) => {
      if (this.config.registers[register].mirror) return;

      const cell = ev.target as HTMLTableCellElement;

      const uneditableString = this.editableRegisters
        ? ""
        : this.registerValues[register] === undefined
          ? this.localeStrings.initialUneditable
          : this.localeStrings.uneditable;

      // If the cell is uneditable, and it's not a pointer register, show a
      // tooltip saying that it's uneditable, and why.
      // The reason why pointer registers do not show this tooltip (even though
      // they are also uneditable) is because they already show that info
      // in their tooltip, a bit further down the code.
      if (!this.config.registers[register].pointer) {
        if (this.editableRegisters) {
          cell.removeAttribute("title");
        } else {
          cell.title = uneditableString;
        }
        return;
      }

      if (!ev.target) return;

      const address = this.registerValues[register];
      if (address === undefined) {
        cell.title = `??\n${uneditableString}`.trimEnd();
        return;
      }

      const data = [];

      // TODO: This breaks if the address is the last one in memory (or close to it),
      // and we don't know the memory size.
      for (let offset = -4; offset < 5; offset++) {
        const readAddress = address + offset;
        if (readAddress < 0) continue;

        const [_, val] = await this.et.emitAndWait(
          "ui:memory:read:result",
          "ui:memory:read",
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

      cell.title = `${row.join(" ")}\n${uneditableString}`.trimEnd();
    };
  }

  createRegisterUI(): void {
    if (!this.panel) return;

    this.registerTable = element(
      "table",
      {
        className: "register-table",
      },
      // Header row
      element(
        "tr",
        ...Object.entries(this.config.registers).map(([name, { pointer, flags }]) =>
          element("th", {
            textContent: name,
            className: `${pointer ? "pointer-register" : ""}`,
            title: pointer
              ? this.localeStrings.pointerRegister
              : flags
                ? this.localeStrings.flags.replace("{flags}", flags.join(", "))
                : "",
          }),
        ),
      ),
      // Register values row
      element(
        "tr",
        ...Object.keys(this.config.registers).map((name) => {
          const config = this.config.registers[name];
          const bytes = config.bits / 8;
          const maxValue = 2 ** (bytes * 8) - 1;
          const size = config.flags ? config.flags.length : bytes * 2;

          let onChange: (value: string) => string | void;
          let pattern: string;
          if (config.flags) {
            // If the register has flags,
            onChange = (value: string) => {
              value = value.toUpperCase();
              const flags = value.split("").filter((c) => c !== "_" && c !== " ");
              // We expect a string with the flags, e.g. "ZC" for zero and carry
              // flags.
              if (flags.length > config.flags!.length) {
                return this.localeStrings.moreFlagsThanExpected;
              }

              // Convert the flags to a number, where each flag is a bit in the
              // number.
              let num = 0;
              for (let i = 0; i < flags.length; i++) {
                const flag = flags[i];
                const flagIndex = config.flags!.indexOf(flag);
                if (flagIndex === -1) {
                  return this.localeStrings.invalidFlag.replace("{flag}", flag);
                }
                num |= 1 << (config.flags!.length - flagIndex - 1);
              }

              // We will receive the result of the write operation in the
              // `ui:memory:write:result` event, and will update the memory
              // cell accordingly, then.
              this.et.emit("dbg:register_update", name, num);
            };
            const flagsString = config.flags.join("");
            pattern = `(?!.*([${flagsString}]).*\\1)[${flagsString}_ ]+`;
          } else {
            // If the register does not have flags, we expect a hex number.
            onChange = (value: string) => {
              const num = Number.parseInt(value, 16);
              if (Number.isNaN(num) || num < 0 || num > maxValue) {
                return this.localeStrings.onlyHex;
              }

              // We will receive the result of the write operation in the
              // `ui:memory:write:result` event, and will update the memory
              // cell accordingly, then.
              this.et.emit("dbg:register_update", name, num);
            };
            // The pattern matches a hex value, with or without the 0x prefix, with
            // the correct number of hex digits (2 per byte).
            pattern = `(0x)?[0-9a-fA-F]{0,${bytes * 2}}`;
          }
          return rewrittableTableElement(
            {
              className: `register-${name} register-bytes-${this.config.registers[name].bits / 8} ${this.config.registers[name].pointer ? "pointer-register" : ""} uneditable`,
              textContent: "?".repeat(size),
              onmouseenter: this.generateTooltipFunction(name),
            },
            {
              bytes,
              onChange,
              pattern,
              editWidth: size,
              validationFailedMsg: config.flags
                ? this.localeStrings.invalidOrWrongNumberOfFlags
                : this.localeStrings.onlyHex,
            },
          );
        }),
      ),
    );

    this.panel.appendChild(this.registerTable);
  }
}

export default RegisterUI;
