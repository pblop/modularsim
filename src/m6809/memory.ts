import type { IModule } from "../general/module.js";
import type { ISimulator } from "../general/simulator.js";
import type { EventDeclaration } from "../types/event.js";

type MemoryType = "ram" | "rom";
type MemoryConfig = {
	start: number;
	size: number;
	type: MemoryType;
};
function validate_memory_config(config: Record<string, unknown>): MemoryConfig {
	// Check that the properties have the correct types.
	if (typeof config.start !== "number") throw new Error("[Memory] start must be a number");
	if (typeof config.size !== "number") throw new Error("[Memory] size must be a number");
	if (typeof config.type !== "string" || !["ram", "rom"].includes(config.type))
		throw new Error(`[Memory] type must be 'ram' or 'rom'`);

	// Now that we know that the properties are there, we can safely cast the config.
	return config as MemoryConfig;
}

class Memory implements IModule {
	simulator: ISimulator;

	memory: Uint8Array;
	start: number;
	type: MemoryType;

	getEventDeclaration(): EventDeclaration {
		return {
			provided: ["memory:read:result"],
			required: [],
			optional: ["memory:read", "memory:write"],
		};
	}

	constructor(config: Record<string, unknown> | undefined, simulator: ISimulator) {
		console.log("[Memory] Initializing module.");

		this.simulator = simulator;

		// Verify that configuration is ok.
		if (!config) throw new Error("[Memory] No configuration provided");

		const parsed_config = validate_memory_config(config);
		const { size, start, type } = parsed_config;

		this.memory = new Uint8Array(size);
		this.start = start;
		this.type = type;

		this.add_listeners();
		console.log(`[Memory] Initialized ${type} memory at ${start} with size ${size}`);
	}

	add_listeners(): void {
		this.simulator.on("memory:read", this.on_memory_read);
		this.simulator.on("memory:write", this.on_memory_write);
	}
	on_memory_read = (address: number): void => {
		// If the address is out of bounds, do nothing.
		if (address < this.start || address >= this.start + this.memory.length) return;

		const data = this.memory[address - this.start];
		// TODO: Add delays here.
		this.simulator.emit("memory:read:result", address, data);
	};
	on_memory_write = (address: number, data: number): void => {
		// If the address is out of bounds, do nothing.
		if (address < this.start || address >= this.start + this.memory.length) return;

		// TODO: Add delays here.
		this.memory[address - this.start] = data;
	};
}

export default Memory;
