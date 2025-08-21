import {LitElement} from '#customary/lit';
import {getDefinition} from "#customary/CustomaryDefinition.js";
import {BIND_ATTRIBUTE} from "#customary/bind/Attribute_bind.js";
import {AddEventListener} from "#customary/events/AddEventListener.js";

type Constructor<T = {}> = new (...args: any[]) => T;

export function Mixin_addEventListenersForBindings
		<T extends Constructor<LitElement>>(superClass: T): T {
			class Mixin_addBindingEventHandlers_Class extends superClass {
				// noinspection JSUnusedGlobalSymbols
				override connectedCallback() {
					super.connectedCallback?.();
					addEventListenersForBindings(this);
				}
			}
			return Mixin_addBindingEventHandlers_Class;
		}

function addEventListenersForBindings(customElement: HTMLElement) {
	const definition = getDefinition(customElement);

	const attributes: string[] = definition.attributes.attributes;
	if (!attributes) return;

	for (const attribute of attributes) {
		new AddEventListener({
			customElement,
			selector: `[${BIND_ATTRIBUTE}="${attribute}"]`,
			type: 'input',
			listener: (el: HTMLElement, e: Event) =>
				matchAttributeToInput(el, attribute, e.target as HTMLInputElement),
		}).execute();
	}
}

function matchAttributeToInput(element: HTMLElement, attribute: string, input: HTMLInputElement) {
	(<any>element)[attribute] = input.type === 'checkbox' ? (input.checked ? 'true' : 'false') : input.value;
}
