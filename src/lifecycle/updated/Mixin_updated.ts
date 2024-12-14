import {LitElement} from 'lit';
import {CustomaryLit} from "#customary/lit/CustomaryLit.js";

type Constructor<T = {}> = new (...args: any[]) => T;
type PropertyValues = Map<PropertyKey, unknown>;

export function Mixin_updated
		<T extends Constructor<LitElement>>(superClass: T): T {
			class Mixin_updated_Class extends superClass {
				// noinspection JSUnusedGlobalSymbols
				protected override updated(changedProperties: PropertyValues) {
					super.updated?.(changedProperties);

					CustomaryLit.getCustomaryDefinition(this)
							.hooks?.lifecycle?.updated?.(this, changedProperties);
				}
			}
			return Mixin_updated_Class;
		}
