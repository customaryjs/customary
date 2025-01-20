import {LitElement} from "#customary/lit";
import {PropertiesInjector} from "#customary/properties/PropertiesInjector.js";
import {CustomaryDeclaration} from "#customary/CustomaryDeclaration";

export class AttributeProperties
{
	static addProperties<T extends HTMLElement>(
			constructor: typeof LitElement,
			declaration: CustomaryDeclaration<T>,
			template: HTMLTemplateElement
	)
	{
		const fromDeclaration = declaration.config?.attributes ?? [];
		const fromTemplate =
				template.getAttribute('data-customary-attributes')?.
				split(',').map(s => s.trim()) ?? [];
		const names = [...new Set([...fromDeclaration, ...fromTemplate])];
		PropertiesInjector.injectProperties(constructor, {reflect: true}, names);
	}
}
