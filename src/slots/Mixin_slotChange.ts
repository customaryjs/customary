import {LitElement} from '#customary/lit';
import {getDefinition} from "#customary/CustomaryDefinition.js";

type Constructor<T = {}> = new (...args: any[]) => T;
type PropertyValues = Map<PropertyKey, unknown>;

export function Mixin_slotChange
		<T extends Constructor<LitElement>>(superClass: T): T {
			class Mixin_slotChange_Class extends superClass {
				// noinspection JSUnusedGlobalSymbols
				protected override firstUpdated(changedProperties: PropertyValues) {
					super.firstUpdated(changedProperties);

					const element = this;

					const definition = getDefinition(element);

					const slotchange =
							definition.declaration.hooks?.slots?.slotchange;

					if (!slotchange) return;

					// on first render, execute once for the first time without an event
					slotchange(element);

					/*
					https://stackoverflow.com/questions/67332635/slots-does-not-work-on-a-html-web-component-without-shadow-dom
					*/
					element.shadowRoot!.addEventListener('slotchange', event => slotchange(element, event));
				}
			}
			return Mixin_slotChange_Class;
		}
