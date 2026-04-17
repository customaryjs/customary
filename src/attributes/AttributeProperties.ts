import {LitElement} from "#customary/lit";
import {PropertiesInjector} from "#customary/properties/PropertiesInjector.js";
import {AttributesDefinition} from "#customary/attributes/AttributesDefinition.js";

export class AttributeProperties
{
	static addProperties(
			constructor: typeof LitElement,
			attributesDefinition: AttributesDefinition,
	)
	{
		for (const name of attributesDefinition.attributes) {
			PropertiesInjector.injectProperties(constructor,
				{ name, propertyDeclaration: {reflect: true} });
		}
	}
}
