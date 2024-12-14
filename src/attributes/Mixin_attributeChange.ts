import {LitElement} from 'lit';
import {CustomaryLit} from "#customary/lit/CustomaryLit.js";

type Constructor<T = {}> = new (...args: any[]) => T;

export function Mixin_attributeChange
		<T extends Constructor<LitElement>>(superClass: T): T {
	class Mixin_attributeChange_Class extends superClass {
		// noinspection JSUnusedGlobalSymbols
		override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
			super.attributeChangedCallback(name, oldValue, newValue);

			CustomaryLit.getCustomaryDefinition(this)
					.hooks?.attributes?.[name]?.(this, name, oldValue, newValue);
		}
	}
	return Mixin_attributeChange_Class;
}
