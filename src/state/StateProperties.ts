import {LitElement} from "#customary/lit";
import {CustomaryDefinition} from "#customary/CustomaryDefinition.js";
import {PropertiesInjector} from "#customary/properties/PropertiesInjector.js";

export class StateProperties {

	static addProperties(
			constructor: typeof LitElement,
			definition: CustomaryDefinition<HTMLElement>
	) {
		const fromDeclaration = definition.declaration.config.state ?? [];
		const fromLegacy = ['state'];
		const names = [...new Set([...fromDeclaration, ...fromLegacy])];
		PropertiesInjector.injectProperties(constructor, {state: true}, names);
	}

}
