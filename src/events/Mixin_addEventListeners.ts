import {getDefinition} from "#customary/CustomaryDefinition.js";
import {AddEventListener} from "#customary/events/AddEventListener.js";

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
			listener: (el: HTMLElement, event: Event, t: EventTarget) => void;
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
		(el: HTMLElement, event: Event, t: EventTarget) => void
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
