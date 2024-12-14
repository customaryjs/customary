import {LitElement} from 'lit';
import {CustomaryLit} from "#customary/lit/CustomaryLit.js";
import {CustomaryEventBroker} from "#customary/events/CustomaryEventBroker.js";

type Constructor<T = {}> = new (...args: any[]) => T;

export const EventsMixin =
		<T extends Constructor<LitElement>>(superClass: T) => {
			class EventsMixinClass extends superClass {
				override updated(changedProperties: Map<string, any>) {
					super.updated?.(changedProperties);

					const element = this;
					const definition = CustomaryLit.getCustomaryDefinition(element);
					new CustomaryEventBroker().addEvents(element, definition.hooks?.events);
				}
			}
			return EventsMixinClass as T;
		}
