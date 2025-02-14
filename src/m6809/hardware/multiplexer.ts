import type { IModule, ModuleDeclaration } from "../../types/module.js";
import type { ISimulator } from "../../types/simulator.js";
import type {
  EventBaseName,
  EventCallbackArgs,
  EventContext,
  EventDeclaration,
  EventDeclarationListeners,
  EventName,
  EventParams,
  TypedEventTransceiver,
} from "../../types/event.js";
import { verify } from "../../general/config.js";
import { joinEventName, separateEventName } from "../../general/event.js";

type MultiplexerEntry = {
  module: string;
  start: number;
  size: number;
  priority: number;
};
type MultiplexerConfig = {
  entries: MultiplexerEntry[];
};

// IMPORTANT: These events' first argument is always the address.
const IncomingEvents: EventBaseName[] = [
  "memory:read",
  "memory:write",
  "ui:memory:read",
  "ui:memory:write",
  "ui:memory:bulk:write",
];
type IncomingEvents = (typeof IncomingEvents)[number];
const OutgoingEvents: EventBaseName[] = [
  "memory:read:result",
  "memory:write:result",
  "ui:memory:read:result",
  "ui:memory:write:result",
  "ui:memory:bulk:write:result",
];
type OutgoingEvents = (typeof OutgoingEvents)[number];

class Multiplexer implements IModule {
  et: TypedEventTransceiver;
  id: string;

  config: MultiplexerConfig;

  getModuleDeclaration(): ModuleDeclaration {
    const incomingEventHandlers = IncomingEvents.map((event) => [event, this.passEventDown(event)]);
    const outgoingEventHandlers = OutgoingEvents.map((event) => [
      joinEventName(event, this.id),
      this.passEventUp(event),
    ]);

    const providedEvents: EventName<EventBaseName>[] = [
      ...IncomingEvents.flatMap((e) => this.config.entries.map((m) => joinEventName(e, m.module))),
      ...OutgoingEvents,
    ];

    return {
      events: {
        provided: providedEvents,
        required: {},
        optional: Object.fromEntries([...incomingEventHandlers, ...outgoingEventHandlers]),
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

    this.config = verify<MultiplexerConfig>(
      config,
      {
        entries: {
          type: "array",
          schema: {
            type: "object",
            properties: {
              module: { type: "string", required: true },
              start: { type: "number", required: true },
              size: { type: "number", required: true },
              priority: { type: "number", default: 0 },
            },
          },
        },
      },
      this.id,
    );

    console.log(`[${this.id}] Initializing Multiplexer module.`);
  }

  getCorrespondingEntry = (address: number): MultiplexerEntry | undefined => {
    const entries = this.config.entries
      .filter((e) => e.start <= address && address < e.start + e.size)
      .sort((a, b) => a.priority - b.priority);
    if (entries.length === 0) {
      console.error(`[${this.id}] No module found for address 0x${address.toString(16)}`);
      return;
    }
    // TODO: Enviar a varios módulos si tienen la misma prioridad.
    return entries[0];
  };

  passEventDown<I extends IncomingEvents>(
    event: EventName<I>,
  ): (...args: EventCallbackArgs<I>) => void {
    const [base, _] = separateEventName(event);
    return (...args: EventCallbackArgs<I>) => {
      // The first argument is always the address (for the incoming events we've set).
      const address = args[0] as number;
      const entry = this.getCorrespondingEntry(address);
      if (!entry) return;

      // Calculate the address relative to the module, and pass it as the first argument to the
      // multiplexed module.
      (args[0] as number) = address - entry.start; // (casted to number to avoid TS error, it's fine)

      // We remove the last argument (context) before passing the args
      const eventArgs = args.slice(0, -1) as EventParams<I>;
      this.et.emit(joinEventName(base, entry.module), ...eventArgs);
    };
  }
  passEventUp<O extends OutgoingEvents>(
    event: EventName<O>,
  ): (...args: EventCallbackArgs<O>) => void {
    const [base, _] = separateEventName(event);
    return (...args: EventCallbackArgs<O>) => {
      const ctx: EventContext = args[args.length - 1] as EventContext;

      // The first argument is always the address (for the incoming events we've set).
      const address = args[0] as number;

      // We need to find the starting address of the module that emitted the event,
      // so we can calculate the absolute address.
      const entry = this.config.entries.find((e) => e.module === ctx.emitter);
      if (!entry) return;

      // Calculate the address relative to the module, and pass it as the first argument to the
      // global event.
      (args[0] as number) = address + entry.start; // (casted to number to avoid TS error, it's fine)

      // We remove the last argument (context) before passing the args
      const eventArgs = args.slice(0, -1) as EventParams<O>;
      this.et.emit(base, ...eventArgs);
    };
  }
}

export default Multiplexer;
