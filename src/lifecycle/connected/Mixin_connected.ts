import {LitElement} from 'lit';
import {getDefinition} from "#customary/CustomaryDefinition.js";

type Constructor<T = {}> = new (...args: any[]) => T;

export function Mixin_connected
		<T extends Constructor<LitElement>>(superClass: T): T {
			class Mixin_connected_Class extends superClass {
				// noinspection JSUnusedGlobalSymbols
				override connectedCallback() {
					super.connectedCallback?.();

					const definition = getDefinition(this);

					definition.declaration.hooks?.lifecycle?.connected?.(this);
				}
			}
			return Mixin_connected_Class;
		}
