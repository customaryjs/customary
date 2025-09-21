import {getDefinition} from "#customary/CustomaryDefinition.js";
import {BIND_ATTRIBUTE} from "#customary/bind/Attribute_bind.js";
import {AddEventListener} from "#customary/events/AddEventListener.js";

export function addEventListenersForBindings(customElement: HTMLElement) {
	const definition = getDefinition(customElement);

	const attributes: string[] = definition.attributes.attributes;
	if (!attributes) return;

	for (const attribute of attributes) {
		new AddEventListener({
			customElement,
			selector: `[${BIND_ATTRIBUTE}="${attribute}"]`,
			type: 'input',
			listener: (el: HTMLElement, e: Event) =>
				matchAttributeToInput(el, attribute, e),
		}).execute();
	}
}

function matchAttributeToInput(
    element: HTMLElement,
    attribute: string,
    e: Event,
) {
    const input: HTMLInputElement = <HTMLInputElement>e.composedPath()[0];
    (<any>element)[attribute] = input.type === 'checkbox' ? (input.checked ? 'true' : 'false') : input.value;
}
