import {LitElement} from '#customary/lit';
import {PropertyValues} from "@lit/reactive-element";
import {getDefinition} from "#customary/CustomaryDefinition.js";

type Constructor<T = {}> = new (...args: any[]) => T;

export function Mixin_updated
		<T extends Constructor<LitElement>>(superClass: T): T {
			class Mixin_updated_Class extends superClass {
				// noinspection JSUnusedGlobalSymbols
				protected override updated(changedProperties: PropertyValues) {
					super.updated?.(changedProperties);

					postUpdate(this, changedProperties);
				}
			}
			return Mixin_updated_Class;
		}


function postUpdate(customElement: LitElement, changedProperties: PropertyValues) {
	const definition = getDefinition(customElement);

	const {lifecycle, changes} = definition.declaration.hooks ?? {};

	lifecycle?.updated?.(customElement, changedProperties);

	if (changes instanceof Array) {
		for (const change of changes) {
			const {name, updated} = change;
			if (updated && changedProperties.has(name)) {
				updated(customElement, (customElement as any)[name], changedProperties.get(name));
			}
		}
	} else {
		for (const name in changes) {
			const updated = changes[name];
			if (changedProperties.has(name)) {
				updated(customElement, (customElement as any)[name], changedProperties.get(name));
			}
		}
	}
}
