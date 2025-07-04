import {LitElement} from '#customary/lit';
import {getDefinition} from "#customary/CustomaryDefinition.js";
import {CustomaryListener} from "#customary/events/CustomaryEventHandlers.js";
import {AddEventListenerToRoot} from "#customary/events/AddEventListenerToRoot.js";

type Constructor<T = {}> = new (...args: any[]) => T;

export function Mixin_addEventListenersToRoot
		<T extends Constructor<LitElement>>(superClass: T): T {
			class Mixin_addEventListenersToRoot_Class extends superClass {
				// noinspection JSUnusedGlobalSymbols
				override connectedCallback() {
					// add the event listeners first so that events dispatched in the connected hook can get handled
					addEventListenersToRoot(this);

					super.connectedCallback?.();
				}
			}
			return Mixin_addEventListenersToRoot_Class;
		}

function addEventListenersToRoot(customElement: HTMLElement) {
	const definition = getDefinition(customElement);

	const events =
		definition.declaration.hooks?.events;
	if (!(events instanceof Array)) return;

	const ops: Array<AddEventListenerToRoot> = eventsArrayToOps(customElement, events);

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
): Array<AddEventListenerToRoot> {
	return events
		.filter(customaryEvent => customaryEvent.selector === undefined)
		.map(customaryEvent =>
			new AddEventListenerToRoot({
				customElement,
				type: customaryEvent.type??
					(() => {
						throw new Error(
							`${customElement.tagName.toLowerCase()}: root event listeners` +
							' require you to provide an event type'
						);
					})(),
				listener: customaryEvent.listener as CustomaryListener,
			})
		);
}
