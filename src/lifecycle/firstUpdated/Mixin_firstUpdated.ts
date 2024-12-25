import {LitElement} from 'lit';
import {CustomaryLit} from "#customary/lit/CustomaryLit.js";

type Constructor<T = {}> = new (...args: any[]) => T;
type PropertyValues = Map<PropertyKey, unknown>;

export function Mixin_firstUpdated
		<T extends Constructor<LitElement>>(superClass: T): T {
			class Mixin_firstUpdated_Class extends superClass {
				// noinspection JSUnusedGlobalSymbols
				protected override firstUpdated(changedProperties: PropertyValues) {
					super.firstUpdated?.(changedProperties);

					CustomaryLit.getCustomaryDefinition(this)
							.declaration.hooks?.lifecycle?.firstUpdated?.(this, changedProperties);
				}
			}
			return Mixin_firstUpdated_Class;
		}
