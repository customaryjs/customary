import {LitElement} from 'lit';
import {PropertyValues} from "@lit/reactive-element";
import {getDefinition} from "#customary/CustomaryDefinition.js";

type Constructor<T = {}> = new (...args: any[]) => T;

export function Mixin_willUpdate
		<T extends Constructor<LitElement>>(superClass: T): T {
			class Mixin_willUpdate_Class extends superClass {
				// noinspection JSUnusedGlobalSymbols
				protected override willUpdate(changedProperties: PropertyValues) {
					super.willUpdate?.(changedProperties);

					const definition = getDefinition(this);

					const {lifecycle, changes} = definition.declaration.hooks ?? {};

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
