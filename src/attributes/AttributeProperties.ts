import {LitElement} from "#customary/lit";
import {CustomaryDefinition} from "#customary/CustomaryDefinition.js";
import {PropertiesInjector} from "#customary/properties/PropertiesInjector.js";

export class AttributeProperties {

	static addProperties<T extends HTMLElement>(
			constructor: typeof LitElement,
			definition: CustomaryDefinition<T>
	) {
		const fromDeclaration = definition.declaration.config?.attributes ?? [];
		const fromTemplate =
				definition.template.getAttribute('data-customary-attributes')?.
				split(',').map(s => s.trim()) ?? [];
		const names = [...new Set([...fromDeclaration, ...fromTemplate])];
		PropertiesInjector.injectProperties(constructor, {reflect: true}, names);
	}

}
