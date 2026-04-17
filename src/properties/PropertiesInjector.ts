import {LitElement} from "#customary/lit";
import {PropertyDeclaration, PropertyDeclarations} from "@lit/reactive-element";

export class PropertiesInjector {
	static injectProperties(
			constructor: typeof LitElement,
			{name, propertyDeclaration, skipExisting}: {
				name: string,
				propertyDeclaration: PropertyDeclaration,
				skipExisting?: boolean,
			}
	) {
		const properties: Writable<PropertyDeclarations> = constructor.properties ??= {};
		if (name in properties) {
			if (skipExisting) return;
			throw new Error(`${name}: property already exists.`);
		}
		properties[name] = propertyDeclaration;
	}
}

type Writable<T> = {-readonly [P in keyof T]: T[P]};
