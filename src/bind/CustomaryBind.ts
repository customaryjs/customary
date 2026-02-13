import {BIND_ATTRIBUTE} from "#customary/bind/Attribute_bind.js";
import {AddEventListener} from "#customary/events/AddEventListener.js";

export class CustomaryBind {
	constructor(customElement: HTMLElement) {
		this.customElement = customElement;
	}
	private readonly customElement: HTMLElement;

	installEventListenersForBindings(attributes: string[]) {
		for (const attribute of attributes) {
			 new AddEventListener({
				 customElement: this.customElement,
				 selector: `[${BIND_ATTRIBUTE}="${attribute}"]`,
				 type: 'input',
				 listener: (el: HTMLElement, e: Event) =>
					 this.matchAttributeToInput(el, attribute, e),
			 }).execute();
		}
	}

	private matchAttributeToInput(
		element: HTMLElement,
		attribute: string,
		e: Event,
	) {
		const input: HTMLInputElement = <HTMLInputElement>e.composedPath()[0];
		(<any>element)[attribute] = input.type === 'checkbox' ? (input.checked ? 'true' : 'false') : input.value;
	}
}
