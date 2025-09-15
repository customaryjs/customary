import {LitElement} from '#customary/lit';
import {getDefinition} from "#customary/CustomaryDefinition.js";
import {AddEventListener} from "#customary/events/AddEventListener.js";

type Constructor<T = {}> = new (...args: any[]) => T;

/*
export function Mixin_addEventListeners
		<T extends Constructor<LitElement>>(superClass: T): T {
			class Mixin_addEventListenersToUpdatedDescendants_Class extends superClass {
				// noinspection JSUnusedGlobalSymbols
				override connectedCallback() {
					super.connectedCallback?.();
                    addEventListeners(this);
				}
			}
			return Mixin_addEventListenersToUpdatedDescendants_Class;
		}

 */

export function addEventListeners(customElement: HTMLElement) {
	const definition = getDefinition(customElement);

	const events =
		definition.declaration.hooks?.events;
	if (!events) return;

	const ops: Array<AddEventListener> =
		events instanceof Array
			? eventsArrayToOps(customElement, events)
			: eventsRecordToOps(customElement, events);

	for (const op of ops) {
		op.execute();
	}
}

function eventsArrayToOps(
	customElement: HTMLElement,
	events: Array<
		{
			selector?: string;
			type?: string;
			listener: (el: HTMLElement, event: Event) => void;
		}
	>
): Array<AddEventListener> {
	return events
		.map(customaryEvent =>
			new AddEventListener({
				customElement,
				selector: customaryEvent.selector,
				type: customaryEvent.type,
				listener: customaryEvent.listener,
			})
		);
}

function eventsRecordToOps(
	customElement: HTMLElement,
	events: Record<
		string,
		(el: HTMLElement, event: Event) => void
	>
): Array<AddEventListener> {
	return Object.entries(events)
		.map(([selector, listener]) =>
			new AddEventListener({
				customElement,
				selector,
				type: undefined,
				listener,
			})
		);
}
