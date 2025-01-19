import {LitElement} from "#customary/lit";
import {CustomaryDetect} from "#customary/CustomaryDetect.js";
import {CustomaryDefine} from "#customary/CustomaryDefine.js";
import {CustomaryDeclaration} from "#customary/CustomaryDeclaration.js";
import {CustomaryRegistry} from "#customary/registry/CustomaryRegistry.js";
import {CustomaryElement} from "#customary/CustomaryElement.js";
import {AttributeProperties} from "#customary/attributes/AttributeProperties.js";
import {StateProperties} from "#customary/state/StateProperties.js";
import {PropertiesProperties} from "#customary/properties/PropertiesProperties.js";

export class Customary {

	static async detect(): Promise<CustomElementConstructor[]> {
		return await Promise.all(
				new CustomaryDetect(document, globalThis)
						.detect()
						.map(one => Customary.define(one))
		);
	}

	static async define<T extends HTMLElement>(
			declaration: Partial<CustomaryDeclaration<T>>
	): Promise<CustomElementConstructor>
	// noinspection JSUnusedGlobalSymbols
	static async define(
			constructor: CustomElementConstructor
	): Promise<CustomElementConstructor>
	static async define<T extends HTMLElement>(
			declarationOrConstructor: Partial<CustomaryDeclaration<T>> | CustomElementConstructor,
	): Promise<CustomElementConstructor>
	{
		const isComponent = typeof declarationOrConstructor === 'function';

		const constructor: CustomElementConstructor = isComponent
				? declarationOrConstructor
				: class EphemeralCustomaryElement extends CustomaryElement {};

		const declaration: Partial<CustomaryDeclaration<T>> = isComponent
				? (constructor as any)?.customary as CustomaryDeclaration<T>
				: declarationOrConstructor;

		const name = declaration?.name ??
				(()=>{
					throw new Error('A name must be provided to define a custom element.')
				})();

		const definition =
				await new CustomaryDefine(name, declaration as CustomaryDeclaration<T>).define();

		AttributeProperties.addProperties(constructor as typeof LitElement, definition);
		StateProperties.addProperties(constructor as typeof LitElement, definition);
		PropertiesProperties.addProperties(constructor as typeof LitElement, definition);

		return await this.customaryRegistry.define(
				name,
				constructor,
				definition,
				{extends: declaration?.config?.define?.extends}
		);
	}

	private static readonly customaryRegistry = CustomaryRegistry.CustomaryRegistry_singleton;

}

export {CustomaryDeclaration};