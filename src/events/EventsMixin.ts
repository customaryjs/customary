import {LitElement} from 'lit';
import {CustomaryLit} from "#customary/lit/CustomaryLit.js";

type Constructor<T = {}> = new (...args: any[]) => T;

export const EventsMixin =
		<T extends Constructor<LitElement>>(superClass: T) => {
			class EventsMixinClass extends superClass {
				override updated(changedProperties: Map<string, any>) {
					super.updated?.(changedProperties);

					CustomaryLit.addEvents(this);
				}
			}
			return EventsMixinClass as T;
		}
