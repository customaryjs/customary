import {AddEventListener} from "#customary/events/AddEventListener.js";
import {CustomaryHooks} from "#customary/CustomaryHooks";

export class CustomaryEvents {
	constructor(
		customElement: HTMLElement,
		hooks: CustomaryHooks<any> | undefined
	) {
		this.customElement = customElement;
		this.hooks = hooks;
	}
	private readonly customElement: HTMLElement;
	private readonly hooks: CustomaryHooks<any> | undefined;

	installEventListeners(
	) {
		const events = this.hooks?.events;
		if (!events) return;

		const ops: Array<AddEventListener> =
			events instanceof Array
				? this.eventsArrayToOps(events)
				: this.eventsRecordToOps(events);

		for (const op of ops) {
			op.execute();
		}
	}

	private eventsArrayToOps(
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
					customElement: this.customElement,
					selector: customaryEvent.selector,
					type: customaryEvent.type,
					listener: customaryEvent.listener,
				})
			);
	}

	private eventsRecordToOps(
		events: Record<
			string,
			(el: HTMLElement, event: Event, t: EventTarget) => void
		>
	): Array<AddEventListener> {
		return Object.entries(events)
			.map(([selector, listener]) =>
				new AddEventListener({
					customElement: this.customElement,
					selector,
					type: undefined,
					listener,
				})
			);
	}
}