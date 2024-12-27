import {LitElement} from 'lit';
import {CustomaryLit} from "#customary/lit/CustomaryLit.js";
import {PropertyValues} from "@lit/reactive-element";

type Constructor<T = {}> = new (...args: any[]) => T;

export function Mixin_firstUpdated
		<T extends Constructor<LitElement>>(superClass: T): T {
			class Mixin_firstUpdated_Class extends superClass {
				// noinspection JSUnusedGlobalSymbols
				protected override firstUpdated(changedProperties: PropertyValues) {
					super.firstUpdated?.(changedProperties);

					const {lifecycle, changes} = CustomaryLit.getCustomaryDefinition(this)
							.declaration.hooks ?? {};
					lifecycle?.firstUpdated?.(this, changedProperties);
					if (changes instanceof Array) {
						for (const change of changes) {
							const {name, firstUpdated} = change;
							if (firstUpdated && changedProperties.has(name)) {
								firstUpdated(this, (this as any)[name], changedProperties.get(name));
							}
						}
					}
				}
			}
			return Mixin_firstUpdated_Class;
		}
