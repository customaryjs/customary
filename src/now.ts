import {Customary} from "#customary/index.js";

document.addEventListener("DOMContentLoaded", (event) => {
	if (!(globalThis as any)[`customary-options:autodetect-dont`]) {
		void Customary.autodetect();
	}
});

export * from '#customary/index.js';
