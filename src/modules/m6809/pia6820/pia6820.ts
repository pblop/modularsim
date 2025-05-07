import { verify } from "../../../utils/config.js";
import {
  emitMultiplexedEvent,
  emitTimed,
  emitTimedMultiplexedEvent,
  toMultiplexedListeners,
  toMultiplexedProvideds,
} from "../../../utils/multiplexutil.js";
import type { EventContext, EventDeclarationListeners, EventName } from "../../../types/event.js";
import type {
  IModule,
  ModuleDeclaration,
  SimulationModuleInteraction,
} from "../../../types/module.js";

type PIA6820Config = {
  /**
   * The module ID of the multiplexer to which this module should send its
   * r/w events.
   */
  multiplexer?: string;

  /**
   * The type of interrupt signal to emit. In the simulated world, this would be
   * like selecting which interrupt line to connect to the irqa and irqb pins.
   */
  irqa?: "irq" | "firq" | "nmi";
  /**
   * See PIA6820Config.irqa.
   */
  irqb?: "irq" | "firq" | "nmi";

  /**
   * The device ID of the device that is connected to line A.
   */
  deviceA?: string;
  /**
   * The device ID of the device that is connected to line B.
   */
  deviceB?: string;
};

enum CRBitmap {
  IRQ1 = 0b10000000,
  IRQ2 = 0b01000000,
  C2CONTROL = 0b00111000,
  DDR_OR = 0b00000100,
  C1CONTROL = 0b00000011,

  // Cx1 to IRQx1 Transition (0=high2low, 1=low2high)
  // This is unused in this device, because we don't simulate rise/fall transitions.
  C12IRQA_TRANSITION = 0b00000010,
  // IRQA (Ext) Enable (0=disable, 1=enable)
  C1_IRQA_ENABLE = 0b00000001,

  // Cx2 Input/Output (0=input, 1=output)
  C2_OUTPUT = 0b00100000,
  // Cx2 to IRQx2 Transition (0=high2low, 1=low2high)
  C22IRQA_TRANSITION = 0b00010000,
  // alias for the same bit but when C2_OUTPUT is set
  C2_CRA4 = 0b00001000,
  // IRQA (Ext) Enable (0=disable, 1=enable)
  C2_IRQA_ENABLE = 0b00001000,
  // alias for the same bit but when C2_OUTPUT is set
  C2_CRA3 = 0b00000100,
}

/**
 * The PIA6820 is a peripheral interface adapter that provides two 8-bit
 * parallel I/O ports (A and B) and a number of control signals. It is
 * commonly used as an I/O interface in the M6800 microprocessor family.
 *
 * In my implementation, I've tried as much as I could to follow the really
 * easily understandable introduction to the PIA6820 in:
 * https://k7mem.com/VC_MEK6800_D1_MC6820_PIA.html
 */
class PIA6820 implements IModule {
  simulation: SimulationModuleInteraction;
  id: string;

  config: PIA6820Config;

  ddra: number; // uint8
  ora: number; // uint8
  cra: number; // uint8
  ddrb: number; // uint8
  orb: number; // uint8
  crb: number; // uint8

  getModuleDeclaration(): ModuleDeclaration {
    let required: EventDeclarationListeners = {};
    const optional: EventDeclarationListeners = {};

    const provided = toMultiplexedProvideds(
      [
        "memory:read:result",
        "memory:write:result",
        "ui:memory:read:result",
        "ui:memory:write:result",
        "ui:memory:bulk:write:result",
      ],
      this.config.multiplexer,
    );
    if (this.config.irqa) provided.push(`signal:${this.config.irqa}`);
    if (this.config.irqb) provided.push(`signal:${this.config.irqb}`);

    if (this.config.deviceA) {
      provided.push(`pia6820:ca/${this.config.deviceA}`);
      required = {
        ...required,
        [`pia6820:ca/${this.config.deviceA}`]: this.onCASignal,
        [`pia6820:data_a/${this.config.deviceA}`]: this.onDataA,
      };
    }
    if (this.config.deviceB) {
      provided.push(`pia6820:cb/${this.config.deviceB}`);
      required = {
        ...required,
        [`pia6820:cb/${this.config.deviceB}`]: this.onCBSignal,
        [`pia6820:data_b/${this.config.deviceB}`]: this.onDataB,
      };
    }

    return {
      events: {
        provided: provided,
        required: required,
        optional: optional,
      },
      cycles: {
        permanent: [],
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

    // Verify that configuration is ok.
    this.config = verify<PIA6820Config>(
      config,
      {
        irqa: {
          type: "string",
          required: false,
          default: undefined,
          enum: ["irq", "firq", "nmi"],
        },
        irqb: {
          type: "string",
          required: false,
          default: undefined,
          enum: ["irq", "firq", "nmi"],
        },
        deviceA: { type: "string", required: false, default: undefined },
        deviceB: { type: "string", required: false, default: undefined },
        multiplexer: { type: "string", required: false, default: undefined },
      },
      this.id,
    );

    this.ddra = 0;
    this.ora = 0;
    this.cra = 0;
    this.ddrb = 0;
    this.orb = 0;
    this.crb = 0;

    console.log(`[${this.id}] Initialized module.`);
  }

  onCASignal = (signal: number): void => {
    if (signal === 1) {
      if (this.cra & CRBitmap.C1_IRQA_ENABLE) {
        // Emit the IRQ signal.
        emitTimed(this.simulation, 101, `signal:${this.config.irqa!}`);
      }
    } else if (signal === 2) {
      if (this.cra & CRBitmap.C2_IRQA_ENABLE && !(this.cra & CRBitmap.C2_OUTPUT)) {
        // Emit the IRQ signal.
        emitTimed(this.simulation, 101, `signal:${this.config.irqa!}`);
      }
    } else {
      throw new Error(
        `[${this.id}] Invalid signal ${signal} received on CA line (only 1 and 2 are valid).`,
      );
    }
  };
  onCBSignal = (signal: number): void => {
    if (signal === 1) {
      if (this.crb & CRBitmap.C1_IRQA_ENABLE) {
        // Emit the IRQ signal.
        emitTimed(this.simulation, 101, `signal:${this.config.irqb!}`);
      }
    } else if (signal === 2) {
      if (this.crb & CRBitmap.C2_IRQA_ENABLE && !(this.crb & CRBitmap.C2_OUTPUT)) {
        // Emit the IRQ signal.
        emitTimed(this.simulation, 101, `signal:${this.config.irqb!}`);
      }
    } else {
      throw new Error(
        `[${this.id}] Invalid signal ${signal} received on CB line (only 1 and 2 are valid).`,
      );
    }
  };

  onResetSignal = (): void => {
    // "After a reset, all of the registers will be set to $00."
    this.ddra = 0;
    this.ora = 0;
    this.cra = 0;
    this.ddrb = 0;
    this.orb = 0;
    this.crb = 0;
  };

  /**
   * Returns the memory representation of the device, which is:
   *  - ddra/ora (1-byte)
   *  - cra (1-byte)
   *  - ddrb/orb (1-byte)
   *  - crb (1-byte)
   */
  getRegisterMap(address: number): number {
    switch (address) {
      case 0:
        // Clear the IRQ bits if reading the data register.
        if (this.cra & CRBitmap.DDR_OR) this.cra &= ~(CRBitmap.IRQ1 | CRBitmap.IRQ2);
        return !(this.cra & CRBitmap.DDR_OR) ? this.ddra : this.ora;
      case 1:
        return this.cra;
      case 2:
        // Clear the IRQ bits if reading the data register.
        if (this.crb & CRBitmap.DDR_OR) this.crb &= ~(CRBitmap.IRQ1 | CRBitmap.IRQ2);
        return !(this.crb & CRBitmap.DDR_OR) ? this.ddrb : this.orb;
      case 3:
        return this.crb;
      default:
        throw new Error(
          `[${this.id}] Attempted to read from invalid memory address ${address} (this device has only 4 bytes of mapped registers).`,
        );
    }
  }

  /**
   * Sets the device config based on the address and data provided (following
   * the memory map).
   */
  setRegisterMap(address: number, data: number): void {
    switch (address) {
      case 0:
        if (this.cra & CRBitmap.DDR_OR) {
          this.ora = data;
        } else {
          this.ddra = data;
        }
        break;
      case 1:
        // Bits 6 and 7 of the two control registers are read only and are
        // read only and are modified by external interrupts ocurring on the
        // CA1, CB1, CA2, and CB2 lines.
        this.cra = data & ~(CRBitmap.IRQ1 | CRBitmap.IRQ2);
        break;
      case 2:
        if (this.crb & CRBitmap.DDR_OR) {
          this.orb = data;
        } else {
          this.ddrb = data;
        }
        break;
      case 3:
        // Bits 6 and 7 are read-only.
        this.crb = data & ~(CRBitmap.IRQ1 | CRBitmap.IRQ2);
        break;
      default:
        throw new Error(
          `[${this.id}] Attempted to write to invalid memory address ${address} (this device has only 4 bytes of mapped registers).`,
        );
    }
  }

  onDataA = (data: number): void => {
    // We need to get only the input bits
    //          clear the input bits    get the new input bits
    this.ora = (this.ora & this.ddra) | (data & ~this.ddra);
  };
  onDataB = (data: number): void => {
    this.orb = (this.orb & this.ddrb) | (data & ~this.ddrb);
  };

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
    if (data.length !== 4)
      throw new Error(
        `[${this.id}] Attempted to write invalid data length ${data.length} (this device has only 4 bytes of mapped registers).`,
      );
    for (let i = 0; i < data.length; i++) {
      this.setRegisterMap(address + i, data[i]);
    }
  };

  onMemoryRead = (address: number) => {
    if (address === 0 && this.cra & CRBitmap.DDR_OR) {
      if (this.cra & CRBitmap.C2_OUTPUT)
        emitTimedMultiplexedEvent(this.simulation, this.config.deviceA, 90, "pia6820:ca", 1);
    } else if (address === 2 && this.crb & CRBitmap.DDR_OR) {
      if (this.crb & CRBitmap.C2_OUTPUT)
        emitTimedMultiplexedEvent(this.simulation, this.config.deviceB, 90, "pia6820:cb", 1);
    }

    emitTimedMultiplexedEvent(
      this.simulation,
      this.config.multiplexer,
      90,
      "memory:read:result",
      address,
      this.getRegisterMap(address),
    );
  };
  onMemoryWrite = (address: number, data: number) => {
    this.setRegisterMap(address, data);

    if (address === 0 && this.cra & CRBitmap.DDR_OR) {
      if (this.cra & CRBitmap.C2_OUTPUT) {
        // Signal to the device that data is ready
        emitTimedMultiplexedEvent(this.simulation, this.config.deviceA, 90, "pia6820:ca", 2);
      }
      emitTimedMultiplexedEvent(
        this.simulation,
        this.config.deviceA,
        95,
        "pia6820:data_a",
        this.ora,
      );
    } else if (address === 2 && this.crb & CRBitmap.DDR_OR) {
      if (this.crb & CRBitmap.C2_OUTPUT && this.crb)
        // Signal to the device that data is ready.
        emitTimedMultiplexedEvent(this.simulation, this.config.deviceB, 90, "pia6820:cb", 2);

      emitTimedMultiplexedEvent(
        this.simulation,
        this.config.deviceB,
        95,
        "pia6820:data_b",
        this.orb,
      );
    }

    emitTimedMultiplexedEvent(
      this.simulation,
      this.config.multiplexer,
      90,
      "memory:write:result",
      address,
      data,
    );
  };
}

export default PIA6820;
