import {LitElement} from "#customary/lit";
import {PropertyDeclaration, PropertyDeclarations} from "@lit/reactive-element";

export class PropertiesInjector {
	static injectProperties(
			constructor: typeof LitElement,
			{propertyDeclaration, names, skipExisting}: {
				propertyDeclaration: PropertyDeclaration,
				names: string[],
				skipExisting?: boolean,
			}
	) {
		if (!names.length) return;
		const properties: Writable<PropertyDeclarations> = constructor.properties ??= {};
		for (const key of names) {
			if (key in properties) {
				if (skipExisting) continue;
				throw new Error(`${key}: property already exists.`);
			}
			properties[key] = propertyDeclaration;
		}
	}
}

type Writable<T> = {-readonly [P in keyof T]: T[P]};
