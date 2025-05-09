import {LitElement} from "#customary/lit";
import {CustomaryDefinition} from "#customary/CustomaryDefinition.js";
import {PropertiesInjector} from "#customary/properties/PropertiesInjector.js";
import {PropertyDeclaration} from "@lit/reactive-element";
import {CustomaryDeclaration} from "#customary/CustomaryDeclaration";

export class PropertiesProperties
{
	static addProperties<T extends HTMLElement>(
			constructor: typeof LitElement,
			declaration: CustomaryDeclaration<T>
	) {
		const hooks = declaration.hooks?.properties;
		const hooksArray: Attrib[] = hooks instanceof Array ? hooks as Attrib[] : [];
		const hooksRecord = hooks && !(hooks instanceof Array) ? hooks : {};

		const fromArray: string[] = hooksArray.map(o => o.name);
		const fromRecord: string[] = Object.keys(hooksRecord);

		const names = [...new Set([...fromArray, ...fromRecord])];

		for (const key of names) {
			PropertiesInjector.injectProperties(constructor,
					hooksArray.find(value => value.name === key)?.propertyDeclaration
					?? hooksRecord[key],
					[key]);
		}
	}
}

type Attrib = {name: string, propertyDeclaration: PropertyDeclaration};
