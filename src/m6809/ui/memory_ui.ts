import type { IModule } from "../../types/module.js";
import type { ISimulator } from "../../types/simulator.js";
import type { EventDeclaration, TypedEventTransceiver } from "../../types/event.js";

class MemoryUI implements IModule {
  event_transceiver: TypedEventTransceiver;
  id: string;

  panel?: HTMLElement;

  getEventDeclaration(): EventDeclaration {
    return {
      provided: ["memory:read", "memory:write"],
      required: {
        "gui:panel_created": this.onGuiPanelCreated,
        "memory:read:result": this.onMemoryReadResult,
        "memory:write:result": this.onMemoryWriteResult,
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
    this.event_transceiver = eventTransceiver;
    this.id = id;

    console.log(`[${this.id}] Memory Initializing module.`);
  }

  onGuiPanelCreated = (panel_id: string, panel: HTMLElement): void => {
    if (this.id !== panel_id) return;
    console.log(`[${this.id}] obtained GUI panel`);

    this.panel = panel;
    this.panel.classList.add("memory-ui");

    this.createMemoryUI();
  };

  onMemoryReadResult = (address: number, data: number): void => {
    if (!this.panel) return;

    const output = this.panel.querySelector(".memory-output");
    if (!output) return;

    output.textContent = `Read 0x${data.toString(16)} from 0x${address.toString(16)}`;
  };

  onMemoryWriteResult = (address: number, data: number): void => {
    if (!this.panel) return;

    const output = this.panel.querySelector(".memory-output");
    if (!output) return;

    output.textContent = `Wrote 0x${data.toString(16)} to 0x${address.toString(16)}`;
  };

  createMemoryUI(): void {
    if (!this.panel) return;

    const addrinput = document.createElement("input");
    addrinput.type = "text";
    addrinput.setAttribute("placeholder", "Memory address");
    this.panel.appendChild(addrinput);
    const valinput = document.createElement("input");
    valinput.type = "text";
    valinput.setAttribute("placeholder", "Value");
    this.panel.appendChild(valinput);

    const write_button = document.createElement("button");
    write_button.textContent = "Write";
    write_button.onclick = () => {
      const address = Number.parseInt(addrinput.value, 16);
      const data = Number.parseInt(valinput.value, 16);
      if (Number.isNaN(address)) return;
      if (Number.isNaN(data)) return;
      this.event_transceiver.emit("memory:write", address, data);
    };
    this.panel.appendChild(write_button);

    const read_button = document.createElement("button");
    read_button.textContent = "Read";
    read_button.onclick = () => {
      const address = Number.parseInt(addrinput.value, 16);
      if (Number.isNaN(address)) return;
      this.event_transceiver.emit("memory:read", address);
    };

    this.panel.appendChild(read_button);

    const output = document.createElement("div");
    output.classList.add("memory-output");
    this.panel.appendChild(output);
  }
}

export default MemoryUI;
