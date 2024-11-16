import {CustomaryDefine} from "#customary/CustomaryDefine.js";
import {CustomaryOptions} from "#customary/CustomaryOptions.js";
import {CustomaryHTMLElement} from "#customary/html/CustomaryHTMLElement.js";
import {CustomaryConfig} from "#customary/CustomaryConfig.js";
import {CustomaryHooks} from "#customary/CustomaryHooks.js";
import {CustomaryRegistry} from "#customary/registry/CustomaryRegistry.js";

export class Customary {

	static readonly config: Record<string, CustomaryConfig> = {};
	static readonly hooks: Record<string, CustomaryHooks<any>> = {};

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
		for (const name of Object.keys(this.hooks)) {
			names.add(name);
		}
		return await Promise.all([...names].map(name => {
			const options = this.detectOptions(name);
			return this.define(
					{
						config: {...(options?.config ?? this.config[name]), name},
						hooks: (options?.hooks ?? this.hooks[name]),
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

		async function ephemeralLit(): Promise<CustomElementConstructor> {
			const x = await import("#customary/lit/CustomaryLitElement.js");
			const CustomaryLitElement = (x as any).CustomaryLitElement;
			return class EphemeralCustomaryLitElement extends CustomaryLitElement {}
		}

		const constructor: CustomElementConstructor = isComponent
				? optionsOrConstructor
				: (globalThis as any).customaryLit
						? await ephemeralLit()
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

	private static readonly customaryRegistry = CustomaryRegistry.CustomaryRegistry_singleton;

}

export {CustomaryOptions};