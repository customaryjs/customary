import {LitElement} from "lit-for-customary";
import {CustomaryDefinition} from "#customary/CustomaryDefinition";
import {PropertyDeclarations} from "@lit/reactive-element";

export class StateProperties {

	static addProperties(
			constructor: typeof LitElement,
			definition: CustomaryDefinition<HTMLElement>
	) {
		const names: string[] = ['state'];
		for (const key of names) {
			const properties: Writable<PropertyDeclarations> = constructor.properties ??= {};
			if (!(key in properties)) {
				properties[key] = {state: true};
			}
		}
	}

}

type Writable<T> = {-readonly [P in keyof T]: T[P]}