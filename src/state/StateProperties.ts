import {LitElement} from "#customary/lit";
import {CustomaryDefinition} from "#customary/CustomaryDefinition.js";
import {PropertiesInjector} from "#customary/properties/PropertiesInjector.js";
import {CustomaryDeclaration} from "#customary/CustomaryDeclaration";

export class StateProperties
{
	static addProperties<T extends HTMLElement>(
			constructor: typeof LitElement,
			declaration: CustomaryDeclaration<T>
	)
	{
		const names = declaration.config?.state ?? [];

		for (const name of names) {
			PropertiesInjector.injectProperties(constructor,
				{name, propertyDeclaration: {state: true}, skipExisting: true});
		}
	}
}
