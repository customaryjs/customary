import {CustomaryDetector} from "#customary/CustomaryDetector.js";
import {CustomaryDeclaration} from "#customary/CustomaryDeclaration.js";
import {CustomaryRegistry} from "#customary/registry/CustomaryRegistry.js";
import {CustomaryElement} from "#customary/CustomaryElement.js";

export class Customary
{
	// noinspection JSUnusedGlobalSymbols
	static async autodetect() {
		await this.detect();

		const customaryRegistry = CustomaryRegistry.singleton();
		await customaryRegistry.settle();
	}

	// noinspection JSUnusedGlobalSymbols
	static declare<T extends HTMLElement>(constructor: CustomElementConstructor)
	{
		const customaryRegistry = CustomaryRegistry.singleton();
		void customaryRegistry.declare(
				constructor,
				(constructor as any)?.customary as CustomaryDeclaration<T>
		);
	}

	// noinspection JSUnusedGlobalSymbols
	static async untilDefined(constructor: CustomElementConstructor): Promise<CustomElementConstructor> {
		const customaryRegistry = CustomaryRegistry.singleton();
		return await customaryRegistry.untilDefined(constructor);
	}

	private static async detect(): Promise<void> {
		const customaryRegistry = CustomaryRegistry.singleton();
		const detector = new CustomaryDetector(document, globalThis);
		const declarations: CustomaryDeclaration<any>[] = detector.detect();
		const promises = declarations.map(declaration =>
				customaryRegistry.declare(
						class EphemeralCustomaryElement extends CustomaryElement {},
						declaration
				)
		);
		await Promise.all(promises);
	}
}
