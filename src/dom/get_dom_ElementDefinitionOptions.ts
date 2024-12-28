import {dom_ElementDefinitionOptions} from "#customary/dom/dom_ElementDefinitionOptions.js";

export function get_dom_ElementDefinitionOptions(
		options: dom_ElementDefinitionOptions,
		customElementConstructor: CustomElementConstructor
): dom_ElementDefinitionOptions | undefined {
	if (customElementConstructor.name === 'EphemeralCustomaryLitElement') {
		return undefined;
	}
	// FIXME phase out? we are fully in lit world now, and extends lacks browser support
	const superclass = Object.getPrototypeOf(customElementConstructor);
	if (!options.extends) {
		return undefined;
	}
	const supername = superclass.name;
	if (!supername.toLowerCase().includes(options.extends)) {
		throw new Error(
				`Your custom element definition declares 'extends' as "${options.extends}", but` +
				` your custom element class extends superclass ${supername}, which is a mismatch. You ` +
				`need to use a matching 'extends' declaration.`);
	}
	return {extends: options.extends};
}
