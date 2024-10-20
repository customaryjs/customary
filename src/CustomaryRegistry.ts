import {CustomaryDefinition} from "customary/CustomaryDefinition.js";
import {CustomaryHTMLElement} from "customary/CustomaryHTMLElement.js";

export class CustomaryRegistry {
    constructor(private readonly customElementRegistry: CustomElementRegistry) {}

    async define<T extends HTMLElement>(
        name: string,
        constructor: CustomElementConstructor,
        definition: CustomaryDefinition<T>,
        dom_ElementDefinitionOptions: dom_ElementDefinitionOptions = {}
    ): Promise<CustomElementConstructor> {
        this.map.set(constructor, definition);
        this.customElementRegistry.define(
            name,
            constructor,
            CustomaryRegistry.get_dom_ElementDefinitionOptions(
                dom_ElementDefinitionOptions, constructor),
        );
        return await this.customElementRegistry.whenDefined(name);
    }

    get<T extends HTMLElement>(
        constructor: CustomElementConstructor
    ): CustomaryDefinition<T> {
        return this.map.get(constructor) ?? (() => {
            throw new Error(`element never defined: ${constructor}`)
        })();
    }

    private static get_dom_ElementDefinitionOptions(
        options: dom_ElementDefinitionOptions,
        customElementConstructor: CustomElementConstructor
    ): dom_ElementDefinitionOptions | undefined {
        const superclass = Object.getPrototypeOf(customElementConstructor);
        if (!options.extends) {
            const superclasses = [HTMLElement, CustomaryHTMLElement];
            if (!superclasses.includes(superclass)) {
                const supername = superclass.name;
                const supernames = superclasses.map(superclass => superclass.name);
                throw new Error(
                    `Your custom element is autonomous, but` +
                    ` your custom element class extends superclass ${supername}, which is a mismatch. You ` +
                    `need to extend one of: ${supernames.join(", ")}`);
            }
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

    private readonly map: Map<CustomElementConstructor, CustomaryDefinition<any>> = new Map();
}

type dom_ElementDefinitionOptions = ElementDefinitionOptions;
