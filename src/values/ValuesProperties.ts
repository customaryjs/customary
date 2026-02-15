import {LitElement} from "#customary/lit";
import {PropertiesInjector} from "#customary/properties/PropertiesInjector.js";
import {CustomaryDeclaration} from "#customary/CustomaryDeclaration";

export class ValuesProperties
{
	static addProperties<T extends HTMLElement>(
			constructor: typeof LitElement,
			declaration: CustomaryDeclaration<T>
	)
	{
		const names = Object.keys(declaration.values ?? {});
		PropertiesInjector.injectProperties(constructor,
			{ propertyDeclaration: {state: true}, names, skipExisting: true });
	}
}
