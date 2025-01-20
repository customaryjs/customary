import {LitElement} from 'lit';
import {PropertyValues} from "@lit/reactive-element";
import {getDefinition} from "#customary/CustomaryDefinition.js";

type Constructor<T = {}> = new (...args: any[]) => T;

export function Mixin_firstUpdated
		<T extends Constructor<LitElement>>(superClass: T): T {
			class Mixin_firstUpdated_Class extends superClass {
				// noinspection JSUnusedGlobalSymbols
				protected override firstUpdated(changedProperties: PropertyValues) {
					super.firstUpdated?.(changedProperties);

					const definition = getDefinition(this);

					const {lifecycle, changes} = definition.declaration.hooks ?? {};

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
