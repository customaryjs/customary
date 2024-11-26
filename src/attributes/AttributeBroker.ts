import {CustomaryDefinition} from "#customary/CustomaryDefinition.js";
import {CustomaryLitElement} from "#customary/lit/CustomaryLitElement.js";

export class AttributeBroker {
	static apply(
			constructor: typeof CustomaryLitElement,
			definition: CustomaryDefinition<HTMLElement>
	) {
		const callbacks = definition.hooks?.attributes;
		if (!callbacks) return;
		const names = Object.keys(callbacks);
		if (!names.length) return;
		const properties = constructor.properties;
		for (const key of names) {
				if (!properties.hasOwnProperty(key)) {
					properties[key] = {reflect: true};
					constructor.createProperty(key, {reflect: true});
				}
		}
	}
}