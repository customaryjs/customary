import {LitElement} from 'lit';
import {CustomaryLit} from "#customary/lit/CustomaryLit.js";

type Constructor<T = {}> = new (...args: any[]) => T;

export function Mixin_addEventHandlers
		<T extends Constructor<LitElement>>(superClass: T): T {
			class Mixin_addEventHandlers_Class extends superClass {
				// noinspection JSUnusedGlobalSymbols
				protected override updated(changedProperties: Map<string, any>) {
					super.updated?.(changedProperties);

					const eventHandlers = CustomaryLit.getCustomaryDefinition(this)
							.hooks?.events;
					if (!eventHandlers) return;

					if (eventHandlers instanceof Array) {
						addEventHandlersFromArray(this, eventHandlers);
					}
					else {
						addEventHandlersFromRecord(this, eventHandlers);
					}
				}
			}
			return Mixin_addEventHandlers_Class;
		}

function addEventHandlersFromArray(
		customElement: HTMLElement,
		eventHandlers: Array<{
			selector?: string;
			type?: string;
			listener: (element: HTMLElement, event: Event) => void;
		}>
) {
	for (const customaryEvent of eventHandlers) {
		const selector = customaryEvent.selector;
		const type = customaryEvent.type;
		const listener = customaryEvent.listener;
		addEventHandler(customElement, selector, type, listener);
	}
}

function addEventHandlersFromRecord(
		customElement: HTMLElement,
		eventHandlers: Record<
				string,
				(element: HTMLElement, event: Event) => void
		>
) {
	for (const [selector, listener] of Object.entries(eventHandlers)) {
		const type = undefined;
		addEventHandler(customElement, selector, type, listener);
	}
}

function addEventHandler(
		customElement: HTMLElement,
		selector: string | undefined,
		type: string | undefined,
		listener: (element: HTMLElement, event: Event) => void
) {
	if (!selector) {
		addEventListener(customElement, customElement, type, listener);
		return;
	}

	const parent: ParentNode = customElement.shadowRoot ?? customElement;
	const elements: NodeListOf<Element> = parent.querySelectorAll(selector);
	for (const element of elements) {
		addEventListener(customElement, element, type, listener);
	}
}

function addEventListener<T extends HTMLElement>(
		customElement: T,
		element: Element,
		type: string | undefined,
		listener: (element: T, event: Event) => void
)
{
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