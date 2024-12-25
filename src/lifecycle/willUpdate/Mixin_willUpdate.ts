import {LitElement} from 'lit';
import {CustomaryLit} from "#customary/lit/CustomaryLit.js";

type Constructor<T = {}> = new (...args: any[]) => T;
type PropertyValues = Map<PropertyKey, unknown>;

export function Mixin_willUpdate
		<T extends Constructor<LitElement>>(superClass: T): T {
			class Mixin_willUpdate_Class extends superClass {
				// noinspection JSUnusedGlobalSymbols
				protected override willUpdate(changedProperties: PropertyValues) {
					super.willUpdate?.(changedProperties);

					CustomaryLit.getCustomaryDefinition(this)
							.declaration.hooks?.lifecycle?.willUpdate?.(this, changedProperties);
				}
			}
			return Mixin_willUpdate_Class;
		}
