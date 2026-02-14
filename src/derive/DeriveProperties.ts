import {LitElement} from "#customary/lit";
import {PropertiesInjector} from "#customary/properties/PropertiesInjector.js";
import {CustomaryDeclaration} from "#customary/CustomaryDeclaration";

export class DeriveProperties {

	static addProperties<T extends HTMLElement>(
			constructor: typeof LitElement,
			declaration: CustomaryDeclaration<T>
	)
	{
		const derive = declaration.hooks?.derive;
		if (!derive) return;

		const names = derive instanceof Array ?
			derive.map(entry => entry.name)
			: Object.keys(derive);

		PropertiesInjector.injectProperties(constructor, {state: true}, names);
	}

}
