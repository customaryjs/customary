import {CustomaryDefine} from "customary/CustomaryDefine.js";
import {CustomaryConstruct} from "customary/CustomaryConstruct.js";
import {CustomaryOptions} from "customary/CustomaryOptions.js";
import {CustomaryHTMLElement} from "customary/CustomaryHTMLElement.js";
import {CustomaryRegistry} from "customary/CustomaryRegistry.js";
import {CustomaryHooks} from "customary/CustomaryHooks.js";

export class Customary {

	static readonly hooks: Record<string, CustomaryHooks<any>> = {};

	static async detect(): Promise<CustomElementConstructor[]> {
		const attribute = 'data-customary-name';
		const names = new Set<string>();
		for (const template of document.querySelectorAll(`template[${attribute}]`)) {
				names.add(template.getAttribute(attribute)!);
		}
		for (const name of Object.keys(this.hooks)) {
			names.add(name);
		}
		return await Promise.all([...names].map(name =>
				this.define(
				{
					config: {name},
					hooks: this.detectHooks(name),
					state: this.detectState(name)
				})
		));
	}

	private static detectState(name: string): object | object[] | undefined {
		const element = document.querySelector(
				`script[type="application/json"][data-customary-name='${name}']`
		);
		return element?.textContent ? JSON.parse(element.textContent) : undefined;
	}

    private static detectHooks<T extends HTMLElement>(name: string): CustomaryHooks<T> | undefined {
		return this.hooks[name];
	}

	static async define<T extends HTMLElement>(
			options: Partial<CustomaryOptions<T>>
	): Promise<CustomElementConstructor>
	static async define(
			constructor: CustomElementConstructor
	): Promise<CustomElementConstructor>
	static async define<T extends HTMLElement>(
			optionsOrConstructor: Partial<CustomaryOptions<T>> | CustomElementConstructor,
	): Promise<CustomElementConstructor>
	{
		const isComponent = typeof optionsOrConstructor === 'function';

		const constructor: CustomElementConstructor = isComponent
				? optionsOrConstructor
				: class EphemeralCustomaryHTMLElement extends CustomaryHTMLElement {};

		const options: Partial<CustomaryOptions<T>> = isComponent
				? (constructor as any)?.customary as CustomaryOptions<T>
				: optionsOrConstructor;

		const name = options?.config?.name ??
				(()=>{
					throw new Error('A name must be provided to define a custom element.')
				})();

		return await this.customaryRegistry.define(
				name,
				constructor,
				await new CustomaryDefine(options as CustomaryOptions<T>).define(),
				{extends: options?.config?.define?.extends}
		);
	}

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

	private static readonly customaryRegistry = new CustomaryRegistry(customElements);

}

export {CustomaryOptions};