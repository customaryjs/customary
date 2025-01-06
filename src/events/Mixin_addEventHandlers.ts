import {LitElement} from 'lit';
import {CustomaryRegistry} from "#customary/registry/CustomaryRegistry.js";

type Constructor<T = {}> = new (...args: any[]) => T;

export function Mixin_addEventHandlers
		<T extends Constructor<LitElement>>(superClass: T): T {
			class Mixin_addEventHandlers_Class extends superClass {
				// noinspection JSUnusedGlobalSymbols
				protected override firstUpdated(changedProperties: Map<string, any>) {
					super.firstUpdated?.(changedProperties);

					const hooks = CustomaryRegistry.getCustomaryDefinition(this)
							.declaration.hooks;
					if (!hooks?.events) return;

					if (hooks.events instanceof Array) {
						for (const customaryEvent of hooks.events) {
							const selector = customaryEvent.selector;
							const type = customaryEvent.type;
							const listener = customaryEvent.listener;
							this.addEventHandler(selector, type, listener as any);
						}
					}
					else {
						for (const [selector, listener] of Object.entries(hooks.events)) {
							const type = undefined;
							this.addEventHandler(selector, type, listener as any);
						}
					}
				}

				private addEventHandler(
						selector: string | undefined,
						type: string | undefined,
						listener: (element: HTMLElement, event: Event) => void
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
						listener: (element: HTMLElement, event: Event) => void
				)
				{
					const tagName = element.tagName;
					element.addEventListener(
							type ??
							getDefaultEventType(tagName) ??
							(() => {
								throw new Error(
										`${this.tagName.toLowerCase()}: ${tagName} elements` +
										' require you to provide an event type' +
										' because Customary has not defined a default yet'
								);
							})(),
							(event: Event) => listener(this, event)
					);
				}

			}
			return Mixin_addEventHandlers_Class;
		}

function getDefaultEventType(tagName: string) {
	switch (tagName) {
		case 'BUTTON':
			return 'click';
		case 'FORM':
			return 'submit';
		case 'INPUT':
			return 'input';
		case 'TABLE':
			return 'click';
		case 'TEXTAREA':
			return 'input';
		default:
			return undefined;
	}
}