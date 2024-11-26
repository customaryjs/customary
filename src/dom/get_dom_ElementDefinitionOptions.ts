import {dom_ElementDefinitionOptions} from "#customary/dom/dom_ElementDefinitionOptions.js";

export function get_dom_ElementDefinitionOptions(
		options: dom_ElementDefinitionOptions,
		customElementConstructor: CustomElementConstructor
): dom_ElementDefinitionOptions | undefined {
	const superclass = Object.getPrototypeOf(customElementConstructor);
	if (!options.extends) {
		const superclasses = [HTMLElement];
		if (superclasses.includes(superclass)) {
			return undefined;
		}
		if (superclass.name === 'CustomaryLitElement') {
			return undefined;
		}
		const supername = superclass.name;
		const supernames = superclasses.map(superclass => superclass.name);
		throw new Error(
				`Your custom element is autonomous, but` +
				` your custom element class extends superclass ${supername}, which is a mismatch. You ` +
				`need to extend one of: ${supernames.join(", ")}`);
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
