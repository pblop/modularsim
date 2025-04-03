import { verify } from "../../general/config.js";
import {
  emitMultiplexedEvent,
  emitTimedMultiplexedEvent,
  toMultiplexedListeners,
  toMultiplexedProvideds,
} from "../../general/multiplexutil.js";
import type { EventContext } from "../../types/event.js";
import type {
  IModule,
  ModuleDeclaration,
  SimulationModuleInteraction,
} from "../../types/module.js";

type InterrupterConfig = {
  /**
   * Whether this module is a device or not (whether it should listen to and
   * emit memory read/write events).
   */
  device: boolean;
  /**
   * The module ID of the multiplexer to which this module should send its
   * r/w events.
   */
  multiplexer?: string;
  /**
   * The number of cycles between each interrupt signal.
   */
  each: number;
  /**
   * The type of interrupt signal to emit.
   */
  type: "nmi" | "irq" | "firq";
};

/**
 * The interrupter module is a device module that emits periodic interrupt
 * signals.
 * The module can be set up with initial values through its configuration,
 * and also be modified in runtime by memory mapping it.
 */
class Interrupter implements IModule {
  simulation: SimulationModuleInteraction;
  id: string;

  config: InterrupterConfig;

  getModuleDeclaration(): ModuleDeclaration {
    // We only listen to/provide memory events if config.device is true.
    const providedMemoryEvents = this.config.device
      ? toMultiplexedProvideds(
          [
            "memory:read",
            "memory:write",
            "ui:memory:read",
            "ui:memory:write",
            "ui:memory:bulk:write",
          ],
          this.config.multiplexer,
        )
      : [];

    const requiredMemoryEvents = this.config.device
      ? toMultiplexedListeners(
          {
            "memory:read": this.onMemoryRead,
            "memory:write": this.onMemoryWrite,
            "ui:memory:read": this.onUiMemoryRead,
            "ui:memory:write": this.onUiMemoryWrite,
            "ui:memory:bulk:write": this.onUiMemoryBulkWrite,
          },
          this.config.multiplexer,
        )
      : {};

    return {
      events: {
        provided: [`signal:${this.config.type}`, ...providedMemoryEvents],
        required: {
          ...requiredMemoryEvents,
        },
        optional: {},
      },
      cycles: {
        permanent: [[this.timerCallback, { subcycle: -1 }]],
      },
    };
  }

  constructor(
    id: string,
    config: Record<string, unknown> | undefined,
    simulation: SimulationModuleInteraction,
  ) {
    // We use the simulator to emit/receive events.
    this.simulation = simulation;
    this.id = id;

    console.log(`[${this.id}] Initializing module.`);

    // Verify that configuration is ok.
    this.config = verify<InterrupterConfig>(
      config,
      {
        each: { type: "number", required: false, default: 0, min: 0, max: 0xffff },
        type: {
          type: "string",
          required: false,
          default: "irq",
          enum: ["nmi", "irq", "firq"],
        },
        device: { type: "boolean", required: false, default: false },
        multiplexer: { type: "string", required: false, default: undefined },
      },
      this.id,
    );

    console.log(`[${this.id}] Initialized module.`);
  }

  timerCallback = (cycle: number, subcycle: number): void => {
    // Emit the event signal.
    if (this.config.each !== 0 && cycle !== 0 && cycle % this.config.each === 0)
      this.simulation.emit(`signal:${this.config.type}`);
  };

  /**
   * Returns the memory representation of the device, which is:
   *  - each (2-byte)
   *  - type (1-byte)
   */
  getRegisterMap(address: number): number {
    if (address === 0 || address === 1) {
      const displacement = address === 0 ? 8 : 0;
      const mask = 0xff << displacement;

      return (this.config.each & mask) >> displacement;
    } else if (address === 2) {
      return this.config.type === "nmi" ? 0x01 : this.config.type === "irq" ? 0x02 : 0x03;
    } else {
      throw new Error(
        `[${this.id}] Attempted to read from invalid memory address ${address} (this device has only 3 bytes of mapped registers).`,
      );
    }
  }

  /**
   * Sets the device config based on the address and data provided (following
   * the memory map).
   */
  setRegisterMap(address: number, data: number): void {
    if (address === 0 || address === 1) {
      const displacement = address === 0 ? 8 : 0;
      const mask = 0xff << displacement;
      //                 clear the bits               set the bits
      this.config.each = (this.config.each & ~mask) | (data << displacement);
    } else if (address === 2) {
      this.config.type = data === 0x01 ? "nmi" : data === 0x02 ? "irq" : "firq";
    } else {
      throw new Error(
        `[${this.id}] Attempted to write from invalid memory address ${address} (this device has only 3 bytes of mapped registers).`,
      );
    }
  }

  onUiMemoryRead = (address: number, ctx: EventContext): void => {
    emitMultiplexedEvent(
      this.simulation,
      this.config.multiplexer,
      "ui:memory:read:result",
      address,
      this.getRegisterMap(address),
    );
  };
  onUiMemoryWrite = (address: number, data: number, ctx: EventContext): void => {
    this.setRegisterMap(address, data);

    emitMultiplexedEvent(
      this.simulation,
      this.config.multiplexer,
      "ui:memory:write:result",
      address,
      data,
    );
  };
  onUiMemoryBulkWrite = (address: number, data: Uint8Array): void => {
    if (data.length !== 3)
      throw new Error(
        `[${this.id}] Attempted to write invalid data length ${data.length} (this device has only 3 bytes of mapped registers).`,
      );
    for (let i = 0; i < data.length; i++) {
      this.setRegisterMap(address + i, data[i]);
    }
  };

  onMemoryRead = (address: number) => {
    emitTimedMultiplexedEvent(
      this.simulation,
      this.config.multiplexer,
      99,
      "ui:memory:read:result",
      address,
      this.getRegisterMap(address),
    );
  };
  onMemoryWrite = (address: number, data: number) => {
    this.setRegisterMap(address, data);

    emitTimedMultiplexedEvent(
      this.simulation,
      this.config.multiplexer,
      0,
      "ui:memory:write:result",
      address,
      data,
    );
  };
}

export default Interrupter;
