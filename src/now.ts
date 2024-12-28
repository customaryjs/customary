import {Customary} from "#customary/index.js";

if (!(globalThis as any)[`customary-flag:detect-dont`]) {
	await Customary.detect();
}

export * from '#customary/index.js';
