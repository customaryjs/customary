import {PropertyValues} from "@lit/reactive-element";

import {LitElement} from '#customary/lit';
import {getDefinition} from "#customary/CustomaryDefinition.js";
import {CustomaryListener} from "#customary/events/CustomaryEventHandlers.js";
import {AddEventListenerToUpdatedDescendants} from "#customary/events/AddEventListenerToUpdatedDescendants.js";

type Constructor<T = {}> = new (...args: any[]) => T;

export function Mixin_addEventListenersToUpdatedDescendants
		<T extends Constructor<LitElement>>(superClass: T): T {
			class Mixin_addEventListenersToUpdatedDescendants_Class extends superClass {
				// noinspection JSUnusedGlobalSymbols
				protected override updated(changedProperties: PropertyValues) {
					// add the event listeners first so that events dispatched in the update hook can get handled
					addEventListenersToUpdatedDescendants(this);

					super.updated?.(changedProperties);
				}
			}
			return Mixin_addEventListenersToUpdatedDescendants_Class;
		}

function addEventListenersToUpdatedDescendants(customElement: HTMLElement) {
	const definition = getDefinition(customElement);

	const events =
		definition.declaration.hooks?.events;
	if (!events) return;

	const ops: Array<AddEventListenerToUpdatedDescendants> =
		events instanceof Array
			? eventsArrayToOps(customElement, events)
			: eventsRecordToOps(customElement, events);

	for (const op of ops) {
		op.execute();
	}
}

function eventsArrayToOps<T extends HTMLElement>(
	customElement: HTMLElement,
	events: Array<
		{
			selector?: string;
			type?: string;
			listener: (el: T, event: Event) => void;
		}
	>
): Array<AddEventListenerToUpdatedDescendants> {
	return events
		.filter(customaryEvent => customaryEvent.selector !== undefined)
		.map(customaryEvent =>
			new AddEventListenerToUpdatedDescendants({
				customElement,
				selector: customaryEvent.selector!,
				type: customaryEvent.type,
				listener: customaryEvent.listener as CustomaryListener,
			})
		);
}

function eventsRecordToOps<T extends HTMLElement>(
	customElement: HTMLElement,
	events: Record<
		string,
		(el: T, event: Event) => void
	>
): Array<AddEventListenerToUpdatedDescendants> {
	return Object.entries(events)
		.map(([selector, listener]) =>
			new AddEventListenerToUpdatedDescendants({
				customElement,
				selector,
				type: undefined,
				listener: listener as CustomaryListener,
			})
		);
}
