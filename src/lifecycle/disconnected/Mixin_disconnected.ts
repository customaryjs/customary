import {LitElement} from 'lit';
import {CustomaryLit} from "#customary/lit/CustomaryLit.js";

type Constructor<T = {}> = new (...args: any[]) => T;

export function Mixin_disconnected
		<T extends Constructor<LitElement>>(superClass: T): T {
			class Mixin_disconnected_Class extends superClass {
				// noinspection JSUnusedGlobalSymbols
				override disconnectedCallback() {
					super.disconnectedCallback?.();

					CustomaryLit.getCustomaryDefinition(this).hooks?.lifecycle?.disconnected?.(this);
				}
			}
			return Mixin_disconnected_Class;
		}
