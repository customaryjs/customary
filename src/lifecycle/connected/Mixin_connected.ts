import {LitElement} from 'lit';
import {CustomaryLit} from "#customary/lit/CustomaryLit.js";

type Constructor<T = {}> = new (...args: any[]) => T;

export function Mixin_connected
		<T extends Constructor<LitElement>>(superClass: T): T {
			class Mixin_connected_Class extends superClass {
				// noinspection JSUnusedGlobalSymbols
				override connectedCallback() {
					super.connectedCallback?.();

					CustomaryLit.getCustomaryDefinition(this)
							.declaration.hooks?.lifecycle?.connected?.(this);
				}
			}
			return Mixin_connected_Class;
		}
