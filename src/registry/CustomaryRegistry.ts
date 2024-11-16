import {CustomaryDefinition} from "#customary/CustomaryDefinition.js";
import {dom_ElementDefinitionOptions} from "#customary/dom/dom_ElementDefinitionOptions.js";
import {get_dom_ElementDefinitionOptions} from "#customary/dom/get_dom_ElementDefinitionOptions.js";

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
            get_dom_ElementDefinitionOptions(dom_ElementDefinitionOptions, constructor),
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

    private readonly map: Map<CustomElementConstructor, CustomaryDefinition<any>> = new Map();

    static readonly CustomaryRegistry_singleton: CustomaryRegistry = new CustomaryRegistry(customElements);
}
