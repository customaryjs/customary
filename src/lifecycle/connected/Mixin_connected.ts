import {LitElement} from '#customary/lit';
import {getDefinition} from "#customary/CustomaryDefinition.js";

type Constructor<T = {}> = new (...args: any[]) => T;

export function execute_hook_connected(element: HTMLElement) {
    const definition = getDefinition(element);

    definition.declaration.hooks?.lifecycle?.connected?.(element);
}

/*
export function Mixin_connected
		<T extends Constructor<LitElement>>(superClass: T): T {
			class Mixin_connected_Class extends superClass {
				// noinspection JSUnusedGlobalSymbols
				override connectedCallback() {
					super.connectedCallback?.();
                    execute_hook_connected(this);
                }
			}
			return Mixin_connected_Class;
		}
*/