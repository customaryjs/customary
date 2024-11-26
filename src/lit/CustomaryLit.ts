import {CustomaryRegistry} from "#customary/registry/CustomaryRegistry.js";
import {CustomaryEventBroker} from "#customary/events/CustomaryEventBroker.js";
import {CustomaryDefinition} from "#customary/CustomaryDefinition.js";

export class CustomaryLit {

	public static templateToRender<T extends HTMLElement>(element: T): HTMLTemplateElement {
		const customaryDefinition = this.getCustomaryDefinition(element);
		return customaryDefinition.template;
	}

	public static getState(element: HTMLElement): any {
		const customaryDefinition = this.getCustomaryDefinition(element);
		return customaryDefinition.state;
	}

	public static addEvents(element: HTMLElement) {
		const customaryDefinition = this.getCustomaryDefinition(element);
		new CustomaryEventBroker().addEvents(element, customaryDefinition.hooks?.events);
	}

	public static getCustomaryDefinition(element: HTMLElement): CustomaryDefinition<HTMLElement> {
		const customaryRegistry = CustomaryRegistry.CustomaryRegistry_singleton;
		return customaryRegistry.get(element.constructor as CustomElementConstructor)!;
	}

}