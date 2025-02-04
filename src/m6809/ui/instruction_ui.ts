import type { IModule } from "../../types/module.js";
import type { EventDeclaration, TypedEventTransceiver } from "../../types/event.js";
import type { Registers } from "../util/cpu_parts.js";
import { element } from "../../general/html.js";
import { decompileInstruction, generateInstructionElement } from "../util/decompile.js";
import { verify } from "../../general/config.js";

type InstructionUIConfig = {
  lines: number;
};

class InstructionUI implements IModule {
  et: TypedEventTransceiver;
  id: string;

  config: InstructionUIConfig;

  registers?: Registers;

  panel?: HTMLElement;

  getEventDeclaration(): EventDeclaration {
    return {
      provided: ["ui:memory:read"],
      required: {
        "ui:memory:read:result": null,
        "gui:panel_created": this.onGuiPanelCreated,
        "cpu:registers_update": this.onRegistersUpdate,
        "signal:reset": this.onReset,
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
    this.config = verify(config, {
      lines: {
        type: "number",
        default: 15,
      },
    });

    console.log(`[${this.id}] Memory Initializing module.`);
  }

  /**
   * Wrapper around the event emitter to read bytes from memory (big-endian).
   */
  read = async (address: number, bytes = 1) => {
    let val = 0;

    for (let i = 0; i < bytes; i++) {
      // TODO: Maybe do some comparison that the read address is the correct one?
      const [_, data] = await this.et.emitAndWait(
        "ui:memory:read",
        "ui:memory:read:result",
        address + i,
      );
      if (data == null) throw new Error(`[${this.id}] read an undefined byte!1!!`);

      val = (val << 8) | data;
    }

    return val;
  };

  onGuiPanelCreated = (panel_id: string, panel: HTMLElement): void => {
    if (this.id !== panel_id) return;
    console.log(`[${this.id}] obtained GUI panel`);

    this.panel = panel;
    this.panel.classList.add("instruction-ui");

    for (let i = 0; i < this.config.lines; i++) {
      this.panel.appendChild(
        element(
          "div",
          { className: "row" },
          element("span", {
            className: "address",
            innerText: "....",
          }),
          element("span", { className: "raw", innerText: "..." }),
          element("span", { className: "data", innerText: "..." }),
          element("span", { className: "extra", innerText: "" }),
        ),
      );
    }
  };

  /**
   * A callback for when the registers are updated.
   * This only happens when an instruction has finished executing, so we can
   * interpret the current value as the start of the an instruction.
   */
  onRegistersUpdate = (registers: Registers): void => {
    if (!this.panel) return;

    const oldRegs = this.registers;
    this.registers = registers.copy();

    // If the PC hasn't changed, we don't need to update the panel.
    if (oldRegs !== undefined && oldRegs.pc === registers.pc) return;

    this.populatePanel();
  };

  onReset = (): void => {
    if (!this.panel) return;

    // Clear the panel.
    for (let i = 0; i < this.config.lines; i++) {
      const children = Array.from(this.panel.children[i].children) as HTMLElement[];
      children[1].innerText = "";
      children[2].innerText = "";
      children[3].innerText = "";
    }

    // Clear the registers.
    this.registers = undefined;
  };

  formatAddress(data: number): string {
    return data.toString(16).padStart(4, "0");
  }

  // NOTE: This function requires the registers to be set.
  populateRow = async (row: HTMLDivElement, address: number, isPC: boolean): Promise<number> => {
    const children = Array.from(row.children) as HTMLSpanElement[];
    const decompiled = await decompileInstruction(this.read, this.registers!, address);
    children[0].innerText = this.formatAddress(address);

    row.classList.toggle("pc", isPC);
    generateInstructionElement(
      decompiled,
      this.formatAddress,
      children[1],
      children[2],
      children[3],
    );
    return decompiled.bytes.length;
  };

  async populatePanel(): Promise<void> {
    if (!this.panel || !this.registers) return;

    const startAddress = this.registers.pc;
    let currentAddress = startAddress;
    for (let i = 0; i < this.config.lines; i++) {
      currentAddress += await this.populateRow(
        this.panel.children[i] as HTMLDivElement,
        currentAddress,
        i === 0,
      );
    }
  }
}

export default InstructionUI;
