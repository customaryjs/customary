import {CustomaryLitElement} from "#customary/lit/CustomaryLitElement";
import {CustomaryDefinition} from "#customary/CustomaryDefinition";

export class StateProperties {

	static addProperties(
			constructor: typeof CustomaryLitElement,
			definition: CustomaryDefinition<HTMLElement>
	) {
		const names: string[] = ['state'];
		const properties = constructor.properties;
		for (const key of names) {
			if (!properties.hasOwnProperty(key)) {
				properties[key] = {};
			}
		}
	}

}
