import {LitElement} from "lit-for-customary";
import {CustomaryDefinition} from "#customary/CustomaryDefinition.js";
import {PropertyDeclaration, PropertyDeclarations} from "@lit/reactive-element";

export class AttributeProperties {
	static addProperties(
			constructor: typeof LitElement,
			definition: CustomaryDefinition<HTMLElement>
	) {
		const hooks = definition.declaration.hooks?.attributes;
		const hooksSArray: string[] = hooks instanceof Array && typeof hooks[0] === 'string' ? hooks as string[] : [];
		const hooksOArray: Attrib[] = hooks instanceof Array && typeof hooks[0] === 'object' ? hooks as Attrib[] : [];
		const hooksRecord = hooks && !(hooks instanceof Array) ? hooks : {};

		const fromSArray: string[] = hooksSArray as string[];
		const fromOArray: string[] = hooksOArray.map(o => o.name);
		const fromRecord: string[] = Object.keys(hooksRecord);
		const fromTemplate =
				definition.template.getAttribute('data-customary-attributes')?.
				split(',').map(s => s.trim()) ?? [];

		const names = [...new Set([...fromSArray, ...fromOArray, ...fromRecord, ...fromTemplate])];

		for (const key of names) {
			const properties: Writable<PropertyDeclarations> = constructor.properties ??= {};
			if (!(key in properties)) {
				properties[key] =
						hooksOArray.find(value => value.name === key)?.propertyDeclaration
						?? hooksRecord[key]
						?? {reflect: true};
			}
		}
	}
}

type Attrib = {name: string, propertyDeclaration: PropertyDeclaration};
type Writable<T> = {-readonly [P in keyof T]: T[P]};
