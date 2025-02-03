import type { IModule } from "../../types/module.js";
import type { EventDeclaration, TypedEventTransceiver } from "../../types/event.js";
import type { Registers } from "../util/cpu_parts.js";
import { element } from "../../general/html.js";
import { decompileInstruction, generateInstructionElement } from "../util/decompile.js";

// biome-ignore lint/complexity/noBannedTypes: <explanation>
type InstructionUIConfig = {};

function validateMemoryUIConfig(config: Record<string, unknown>): InstructionUIConfig {
  return config as InstructionUIConfig;
}

class HistoryUI implements IModule {
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
        "signal:reset": this.clearPanel,
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
    this.config = validateMemoryUIConfig(config);

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

    // this.anchor = element("div", { properties: { className: "scroll-anchor" } });
    // this.panel.appendChild(this.anchor);
  };

  onRegistersUpdate = (registers: Registers): void => {
    if (!this.panel) return;

    const oldRegs = this.registers;
    this.registers = registers.copy();

    // If the PC hasn't changed, we don't need to update the panel.
    if (oldRegs !== undefined && oldRegs.pc === registers.pc) return;

    this.populatePanel();
  };

  clearPanel = (): void => {
    if (!this.panel) return;

    // Clear the panel.
    this.panel.innerHTML = "";
  };

  formatAddress(data: number): string {
    return data.toString(16).padStart(4, "0");
  }

  async populatePanel(): Promise<void> {
    if (!this.panel || !this.registers) return;

    const startAddress = this.registers.pc;
    let currentAddress = startAddress;

    const row = element(
      "div",
      { className: "row" },
      element("span", {
        className: "address",
        innerText: "0000",
      }),
      element("span", { className: "raw", innerText: "..." }),
      element("span", { className: "data", innerText: "..." }),
      element("span", { className: "extra", innerText: "" }),
    );

    const decompiled = await decompileInstruction(this.read, this.registers, currentAddress);
    (row.children[0] as HTMLSpanElement).innerText = this.formatAddress(currentAddress);
    if (decompiled != null) {
      generateInstructionElement(
        decompiled,
        this.formatAddress,
        row.children[1] as HTMLSpanElement,
        row.children[2] as HTMLSpanElement,
        row.children[3] as HTMLSpanElement,
      );

      currentAddress += decompiled.size;
    } else {
      (row.children[2] as HTMLSpanElement).innerText = "??";
    }

    // Auto scroll to bottom if already on bottom. I haven't been able to achieve
    // this with CSS, so I'm doing it here.
    const atBottom = this.panel.scrollHeight - this.panel.clientHeight <= this.panel.scrollTop + 1;
    this.panel.appendChild(row);
    if (atBottom) this.panel.scrollTop = this.panel.scrollHeight - this.panel.clientHeight;
  }
}

export default HistoryUI;
