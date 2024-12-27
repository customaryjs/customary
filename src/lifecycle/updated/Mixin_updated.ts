import {LitElement} from 'lit';
import {CustomaryLit} from "#customary/lit/CustomaryLit.js";
import {PropertyValues} from "@lit/reactive-element";

type Constructor<T = {}> = new (...args: any[]) => T;

export function Mixin_updated
		<T extends Constructor<LitElement>>(superClass: T): T {
			class Mixin_updated_Class extends superClass {
				// noinspection JSUnusedGlobalSymbols
				protected override updated(changedProperties: PropertyValues) {
					super.updated?.(changedProperties);

					const {lifecycle, changes} = CustomaryLit.getCustomaryDefinition(this)
							.declaration.hooks ?? {};
					lifecycle?.updated?.(this, changedProperties);
					if (changes instanceof Array) {
						for (const change of changes) {
							const {name, updated} = change;
							if (updated && changedProperties.has(name)) {
								updated(this, (this as any)[name], changedProperties.get(name));
							}
						}
					}
					else {
						for (const name in changes) {
							const updated = changes[name];
							if (changedProperties.has(name)) {
								updated(this, (this as any)[name], changedProperties.get(name));
							}
						}
					}
				}
			}
			return Mixin_updated_Class;
		}
