import {PropertyValues} from "@lit/reactive-element";

import {LitElement} from '#customary/lit';
import {getDefinition} from "#customary/CustomaryDefinition.js";
import {BIND_ATTRIBUTE} from "#customary/bind/Attribute_bind.js";
import {AddEventListenerToUpdatedDescendants} from "#customary/events/AddEventListenerToUpdatedDescendants.js";

type Constructor<T = {}> = new (...args: any[]) => T;

export function Mixin_addEventListenersForBindings
		<T extends Constructor<LitElement>>(superClass: T): T {
			class Mixin_addBindingEventHandlers_Class extends superClass {
				// noinspection JSUnusedGlobalSymbols
				protected override updated(changedProperties: PropertyValues) {
					// add the event listeners first so that events dispatched in the update hook can get handled
					addEventListenersForBindings(this);

					super.updated?.(changedProperties);
				}
			}
			return Mixin_addBindingEventHandlers_Class;
		}

function addEventListenersForBindings(customElement: HTMLElement) {
	const definition = getDefinition(customElement);

	const attributes: string[] = definition.attributes.attributes;
	if (!attributes) return;

	for (const attribute of attributes) {
		new AddEventListenerToUpdatedDescendants({
			customElement,
			selector: `[${BIND_ATTRIBUTE}="${attribute}"]`,
			type: undefined,
			listener: (element: HTMLElement, event: Event) =>
				matchAttributeToInput(element, attribute, event.target as HTMLInputElement),
		}).execute();
	}
}

function matchAttributeToInput(element: HTMLElement, attribute: string, input: HTMLInputElement) {
	(<any>element)[attribute] = input.type === 'checkbox' ? (input.checked ? 'true' : 'false') : input.value;
}
