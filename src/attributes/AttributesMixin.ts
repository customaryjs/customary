import {LitElement} from 'lit';
import {CustomaryLit} from "#customary/lit/CustomaryLit.js";
import {Customary_attributeChangedCallback} from "#customary/attributes/AttributeHooks.js";

type Constructor<T = {}> = new (...args: any[]) => T;

export const AttributesMixin =
		<T extends Constructor<LitElement>>(superClass: T) => {
	class AttributesMixinClass extends superClass {
		override attributeChangedCallback(property: string, oldValue: string, newValue: string) {
			super.attributeChangedCallback(property, oldValue, newValue);

			const element = this;
			const definition = CustomaryLit.getCustomaryDefinition(element);

			definition.hooks?.attributes?.[property]?.(element, property, oldValue, newValue);
		}
	}
	return AttributesMixinClass as T;
}
