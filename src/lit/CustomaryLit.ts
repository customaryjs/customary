import {CustomaryRegistry} from "#customary/registry/CustomaryRegistry.js";
import {EventConnector} from "#customary/events/EventConnector.js";
import {CustomaryDefinition} from "#customary/CustomaryDefinition.js";

export class CustomaryLit {

	public static templateToRender<T extends HTMLElement>(element: T): HTMLTemplateElement {
		const customaryDefinition = this.getCustomaryDefinition(element);
		return customaryDefinition.template;
	}

	public static addEvents(element: HTMLElement) {
		const customaryDefinition = this.getCustomaryDefinition(element);
		new EventConnector().addEvents(element, customaryDefinition.hooks?.events);
	}

	public static getCustomaryDefinition(element: HTMLElement): CustomaryDefinition<HTMLElement> {
		const customaryRegistry = CustomaryRegistry.CustomaryRegistry_singleton;
		return customaryRegistry.get(element.constructor as CustomElementConstructor)!;
	}

}