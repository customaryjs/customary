import {LitElement} from '#customary/lit';
import {getDefinition} from "#customary/CustomaryDefinition.js";
import {PropertyValues} from "@lit/reactive-element";

type Constructor<T = {}> = new (...args: any[]) => T;

type CustomaryListener = (element: HTMLElement, event: Event) => void;

export function Mixin_addEventHandlers
		<T extends Constructor<LitElement>>(superClass: T): T {
			class Mixin_addEventHandlers_Class extends superClass {
				// noinspection JSUnusedGlobalSymbols
				protected override updated(changedProperties: PropertyValues) {
					super.updated?.(changedProperties);

					const definition = getDefinition(this);

					const events =
							definition.declaration.hooks?.events;
					if (!events) return;

					if (events instanceof Array) {
						for (const customaryEvent of events) {
							const selector = customaryEvent.selector;
							const type = customaryEvent.type;
							const listener = customaryEvent.listener;
							this.addEventHandler(selector, type, listener as any);
						}
					}
					else {
						for (const [selector, listener] of Object.entries(events)) {
							const type = undefined;
							this.addEventHandler(selector, type, listener as any);
						}
					}
				}

				private addEventHandler(
						selector: string | undefined,
						type: string | undefined,
						listener: CustomaryListener
				) {
					if (!selector) {
						this.addCustomEventListener(this, type, listener);
						return;
					}

					const parent: ParentNode = this.shadowRoot ?? this;
					const elements: NodeListOf<Element> = parent.querySelectorAll(selector);
					for (const element of elements) {
						this.addCustomEventListener(element, type, listener);
					}
				}

				private addCustomEventListener(
						element: Element,
						type: string | undefined,
						listener: CustomaryListener
				)
				{
					const listeners: Array<CustomaryListener> =
							(element as any).__customary_listeners ??= [];
					if (listeners.includes(listener)) {
						return;
					}
					const tagName = element.tagName;
					element.addEventListener(
							type ??
							DEFAULT_EVENT_TYPES[tagName] ??
							(() => {
								throw new Error(
										`${this.tagName.toLowerCase()}: ${tagName} elements` +
										' require you to provide an event type' +
										' because Customary has not defined a default yet'
								);
							})(),
							(event: Event) => listener(this, event)
					);
					listeners.push(listener);
				}

			}
			return Mixin_addEventHandlers_Class;
		}

const DEFAULT_EVENT_TYPES: Record<string, string> = {
	'A': 'click',
	'BUTTON': 'click',
	'FORM': 'submit',
	'INPUT': 'input',
	'SELECT': 'input',
	'TABLE': 'click',
	'TEXTAREA': 'input',
}