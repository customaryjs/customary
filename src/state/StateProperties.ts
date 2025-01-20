import {LitElement} from "#customary/lit";
import {CustomaryDefinition} from "#customary/CustomaryDefinition.js";
import {PropertiesInjector} from "#customary/properties/PropertiesInjector.js";
import {CustomaryDeclaration} from "#customary/CustomaryDeclaration";

export class StateProperties {

	static addProperties<T extends HTMLElement>(
			constructor: typeof LitElement,
			declaration: CustomaryDeclaration<T>
	)
	{
		const fromDeclaration = declaration.config?.state ?? [];
		const fromLegacy = ['state'];
		const names = [...new Set([...fromDeclaration, ...fromLegacy])];
		PropertiesInjector.injectProperties(constructor, {state: true}, names);
	}

}
