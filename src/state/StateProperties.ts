import {CustomaryLitElement} from "#customary/lit/CustomaryLitElement";
import {CustomaryDefinition} from "#customary/CustomaryDefinition";
import {PropertyDeclaration} from "@lit/reactive-element";

export class StateProperties {

	static addProperties(
			constructor: typeof CustomaryLitElement,
			definition: CustomaryDefinition<HTMLElement>
	) {
		const names: string[] = ['state'];
		const properties = constructor.properties;
		for (const key of names) {
			if (!properties.hasOwnProperty(key)) {
				const propertyDeclaration: PropertyDeclaration = {};
				properties[key] = propertyDeclaration;
				constructor.createProperty(key, propertyDeclaration);
			}
		}
	}

}
