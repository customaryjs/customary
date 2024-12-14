import {CustomaryRegistry} from "#customary/registry/CustomaryRegistry.js";
import {CustomaryDefinition} from "#customary/CustomaryDefinition.js";

export class CustomaryLit {

	public static getCustomaryDefinition(element: HTMLElement): CustomaryDefinition<HTMLElement> {
		const customaryRegistry = CustomaryRegistry.CustomaryRegistry_singleton;
		return customaryRegistry.get(element.constructor as CustomElementConstructor)!;
	}

}