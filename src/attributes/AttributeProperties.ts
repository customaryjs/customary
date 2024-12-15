import {CustomaryDefinition} from "#customary/CustomaryDefinition.js";
import {CustomaryLitElement} from "#customary/lit/CustomaryLitElement.js";
import {PropertyDeclaration} from "@lit/reactive-element";

export class AttributeProperties {
	static addProperties(
			constructor: typeof CustomaryLitElement,
			definition: CustomaryDefinition<HTMLElement>
	) {
		const names: string[] = getNames(definition);
		const properties = constructor.properties;
		for (const key of names) {
				if (!properties.hasOwnProperty(key)) {
					const propertyDeclaration: PropertyDeclaration = {reflect: true};
					properties[key] = propertyDeclaration;
					constructor.createProperty(key, propertyDeclaration);
				}
		}
	}
}

function getNames(definition: CustomaryDefinition<HTMLElement>): string[] {
	const fromAttributes =
			definition.template.getAttribute('data-customary-attributes')?.
				split(',').map(s => s.trim()) ?? [];

	const fromCallbacks = Object.keys(definition.hooks?.attributes ?? {});

	return [...new Set([...fromAttributes, ...fromCallbacks])];
}
