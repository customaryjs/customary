import {LitElement} from '#customary/lit';
import {CustomaryRegistry} from "#customary/registry/CustomaryRegistry.js";

type Constructor<T = {}> = new (...args: any[]) => T;

export function Mixin_attributeChangedCallback
		<T extends Constructor<LitElement>>(superClass: T): T {
	class Mixin_attributeChangedCallback_Class extends superClass {
		// noinspection JSUnusedGlobalSymbols
		override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
			super.attributeChangedCallback(name, oldValue, newValue);

			CustomaryRegistry.getCustomaryDefinition(this)
					.declaration.hooks?.dom?.attributeChangedCallback
					?.(this, name, oldValue, newValue);
		}
	}
	return Mixin_attributeChangedCallback_Class;
}
