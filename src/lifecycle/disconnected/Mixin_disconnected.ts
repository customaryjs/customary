import {LitElement} from 'lit';
import {getDefinition} from "#customary/CustomaryDefinition.js";

type Constructor<T = {}> = new (...args: any[]) => T;

export function Mixin_disconnected
		<T extends Constructor<LitElement>>(superClass: T): T {
			class Mixin_disconnected_Class extends superClass {
				// noinspection JSUnusedGlobalSymbols
				override disconnectedCallback() {
					super.disconnectedCallback?.();

					const definition = getDefinition(this);

					definition.declaration.hooks?.lifecycle?.disconnected?.(this);
				}
			}
			return Mixin_disconnected_Class;
		}
