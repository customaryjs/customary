import {CustomaryConstruct} from "#customary/CustomaryConstruct.js";
import {CustomaryRegistry} from "#customary/registry/CustomaryRegistry.js";

export class CustomaryHTML {

	static construct<T extends HTMLElement>(element: T) {
		const customaryDefinition =
				this.customaryRegistry.get(element.constructor as CustomElementConstructor)!;
		new CustomaryConstruct().construct(element, customaryDefinition);
	}

	static connectedCallback<T extends HTMLElement>(element: T) {
		const constructor = element.constructor as CustomElementConstructor;
		const customaryDefinition = this.customaryRegistry.get(constructor)!;
		customaryDefinition.hooks?.lifecycle?.connected?.(element);
	}

	static disconnectedCallback<T extends HTMLElement>(element: T) {
		const constructor = element.constructor as CustomElementConstructor;
		const customaryDefinition = this.customaryRegistry.get(constructor)!;
		customaryDefinition.hooks?.lifecycle?.disconnected?.(element);
	}

	static adoptedCallback<T extends HTMLElement>(element: T) {
		const constructor = element.constructor as CustomElementConstructor;
		const customaryDefinition = this.customaryRegistry.get(constructor)!;
		customaryDefinition.hooks?.lifecycle?.adopted?.(element);
	}

	static observedAttributes(constructor: CustomElementConstructor): string[] | undefined {
		const customaryDefinition = this.customaryRegistry.get(constructor)!;
		const attributes = customaryDefinition.hooks?.attributes;
		return attributes ? Object.keys(attributes) : undefined;
	}

	static attributeChangedCallback<T extends HTMLElement>(
			element: T, property: string, oldValue: string, newValue: string
	) {
		const constructor = element.constructor as CustomElementConstructor;
		const customaryDefinition = this.customaryRegistry.get(constructor)!;
		customaryDefinition.hooks?.attributes?.[property]?.(
				element, property, oldValue, newValue);
	}

	private static readonly customaryRegistry = CustomaryRegistry.CustomaryRegistry_singleton;

}