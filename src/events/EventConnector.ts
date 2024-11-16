import {CustomaryEventListener, CustomaryEvents} from "#customary/CustomaryHooks";

export class EventConnector<T extends HTMLElement> {
	addEvents(customElement: T, customaryEvents: CustomaryEvents<T> | undefined) {
		if (!customaryEvents) return;
		if (customaryEvents instanceof Array) {
			for (const customaryEvent of customaryEvents) {
				const selector = customaryEvent.selector;
				const type = customaryEvent.type;
				const listener = customaryEvent.listener;
				this.addEvent(customElement, selector, type, listener);
			}
			return;
		}
		for (const [selector, listener] of Object.entries(customaryEvents)) {
			const type = undefined;
			this.addEvent(customElement, selector, type, listener);
		}
	}

	addEvent(
			customElement: T,
			selector: string,
			type: string | undefined,
			listener: CustomaryEventListener<T>
	) {
		const parent: ParentNode = customElement.shadowRoot ?? customElement;
		const elements: NodeListOf<Element> = parent.querySelectorAll(selector);
		for (const element of elements) {
			const tagName = element.tagName;
			element.addEventListener(
					type ??
					getDefaultEventType(tagName) ??
					(() => {
						throw new Error(
								`${customElement.tagName.toLowerCase()}: ${tagName} elements` +
								' require you to provide an event type' +
								' because Customary has not defined a default yet'
						);
					})(),
					(event: Event) => listener(customElement, event)
			);
		}
	}
}

function getDefaultEventType(tagName: string) {
	switch (tagName) {
		case 'BUTTON':
			return 'click';
		case 'FORM':
			return 'submit';
		case 'TABLE':
			return 'click';
		default:
			return undefined;
	}
}