import {CustomaryDefine} from "#customary/CustomaryDefine.js";
import {CustomaryOptions} from "#customary/CustomaryOptions.js";
import {CustomaryRegistry} from "#customary/registry/CustomaryRegistry.js";
import {CustomaryLitElement} from "#customary/lit/CustomaryLitElement.js";
import {AttributeBroker} from "#customary/attributes/AttributeBroker.js";

export class Customary {

	static async detect(): Promise<CustomElementConstructor[]> {
		const attribute = 'data-customary-name';
		const names = new Set<string>();
		for (const template of document.querySelectorAll(`template[${attribute}]`)) {
				names.add(template.getAttribute(attribute)!);
		}
		for (const name of Object.keys(globalThis)) {
			const s = 'customary:';
			if (name.startsWith(s)) {
				names.add(name.substring(s.length));
			}
		}
		return await Promise.all([...names].map(name => {
			const options = this.detectOptions(name);
			return this.define(
					{
						config: {...options?.config, name},
						hooks: options?.hooks,
						state: (options?.state ?? this.detectState(name))
					})
			}
		));
	}

	private static detectOptions<T extends HTMLElement>(name: string): CustomaryOptions<T> | undefined {
		return (globalThis as any)[`customary:${name}`];
	}

	private static detectState(name: string): object | object[] | undefined {
		const element = document.querySelector(
				`script[type="application/json"][data-customary-name='${name}']`
		);
		return element?.textContent ? JSON.parse(element.textContent) : undefined;
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
				: class EphemeralCustomaryLitElement extends CustomaryLitElement {};

		const options: Partial<CustomaryOptions<T>> = isComponent
				? (constructor as any)?.customary as CustomaryOptions<T>
				: optionsOrConstructor;

		const name = options?.config?.name ??
				(()=>{
					throw new Error('A name must be provided to define a custom element.')
				})();

		const definition = await new CustomaryDefine(options as CustomaryOptions<T>).define();

		AttributeBroker.apply(constructor as typeof CustomaryLitElement, definition);

		return await this.customaryRegistry.define(
				name,
				constructor,
				definition,
				{extends: options?.config?.define?.extends}
		);
	}

	private static readonly customaryRegistry = CustomaryRegistry.CustomaryRegistry_singleton;

}

export {CustomaryOptions};