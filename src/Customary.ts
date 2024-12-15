import {CustomaryDetect} from "#customary/CustomaryDetect.js";
import {CustomaryDefine} from "#customary/CustomaryDefine.js";
import {CustomaryOptions} from "#customary/CustomaryOptions.js";
import {CustomaryRegistry} from "#customary/registry/CustomaryRegistry.js";
import {CustomaryLitElement} from "#customary/lit/CustomaryLitElement.js";
import {AttributeProperties} from "#customary/attributes/AttributeProperties.js";
import {StateProperties} from "#customary/state/StateProperties.js";

export class Customary {

	static async detect(): Promise<CustomElementConstructor[]> {
		return await Promise.all(
				new CustomaryDetect(document, globalThis)
						.detect()
						.map(one => Customary.define(one))
		);
	}

	static async define<T extends HTMLElement>(
			options: Partial<CustomaryOptions<T>>
	): Promise<CustomElementConstructor>
	// noinspection JSUnusedGlobalSymbols
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

		AttributeProperties.addProperties(constructor as typeof CustomaryLitElement, definition);
		StateProperties.addProperties(constructor as typeof CustomaryLitElement, definition);

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