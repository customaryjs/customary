import {CustomaryDefinition} from "#customary/CustomaryDefinition.js";
import {CustomaryLitElement} from "#customary/lit/CustomaryLitElement.js";

export class AttributeBroker {
	static apply(
			constructor: typeof CustomaryLitElement,
			definition: CustomaryDefinition<HTMLElement>
	) {
		const names: string[] = getNames(definition);
		const properties = constructor.properties;
		for (const key of names) {
				if (!properties.hasOwnProperty(key)) {
					properties[key] = {reflect: true};
					constructor.createProperty(key, {reflect: true});
				}
		}
	}
}

function getNames(definition: CustomaryDefinition<HTMLElement>): string[] {
	const names: string[] = [];

	const attributes = definition.template.getAttribute('data-customary-attributes');
	if (attributes) {
		names.push(...attributes.split(',').map(s => s.trim()));
	}

	const callbacks = definition.hooks?.attributes;
	if (callbacks) {
		names.push(...Object.keys(callbacks));
	}

	return names;
}