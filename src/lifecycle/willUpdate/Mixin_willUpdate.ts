import {LitElement} from 'lit';
import {CustomaryLit} from "#customary/lit/CustomaryLit.js";
import {PropertyValues} from "@lit/reactive-element";

type Constructor<T = {}> = new (...args: any[]) => T;

export function Mixin_willUpdate
		<T extends Constructor<LitElement>>(superClass: T): T {
			class Mixin_willUpdate_Class extends superClass {
				// noinspection JSUnusedGlobalSymbols
				protected override willUpdate(changedProperties: PropertyValues) {
					super.willUpdate?.(changedProperties);

					const {lifecycle, changes} = CustomaryLit.getCustomaryDefinition(this)
							.declaration.hooks ?? {};
					lifecycle?.willUpdate?.(this, changedProperties);
					if (changes instanceof Array) {
						for (const change of changes) {
							const {name, willUpdate} = change;
							if (willUpdate && changedProperties.has(name)) {
								willUpdate(this, (this as any)[name], changedProperties.get(name));
							}
						}
					}
				}
			}
			return Mixin_willUpdate_Class;
		}
