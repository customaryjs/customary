import {LitElement} from "lit-for-customary";
import {PropertyDeclaration, PropertyDeclarations} from "@lit/reactive-element";

export class PropertiesInjector {
	static injectProperties(
			constructor: typeof LitElement,
			propertyDeclaration: PropertyDeclaration,
			names: string[]
	) {
		if (!names.length) return;
		const properties: Writable<PropertyDeclarations> = constructor.properties ??= {};
		for (const key of names) {
			if (key in properties) throw new Error(`${key}: property already exists.`);
			properties[key] = propertyDeclaration;
		}
	}
}

type Writable<T> = {-readonly [P in keyof T]: T[P]};
