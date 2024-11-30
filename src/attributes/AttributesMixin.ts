import {LitElement} from 'lit';
import {CustomaryLit} from "#customary/lit/CustomaryLit.js";

type Constructor<T = {}> = new (...args: any[]) => T;

export const AttributesMixin =
		<T extends Constructor<LitElement>>(superClass: T) => {
	class AttributesMixinClass extends superClass {
		override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
			super.attributeChangedCallback(name, oldValue, newValue);

			const element = this;
			const definition = CustomaryLit.getCustomaryDefinition(element);

			definition.hooks?.attributes?.[name]?.(element, name, oldValue, newValue);
		}
	}
	return AttributesMixinClass as T;
}
