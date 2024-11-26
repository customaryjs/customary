import {CustomaryDefinition} from "#customary/CustomaryDefinition.js";
import {dom_ElementDefinitionOptions} from "#customary/dom/dom_ElementDefinitionOptions.js";
import {get_dom_ElementDefinitionOptions} from "#customary/dom/get_dom_ElementDefinitionOptions.js";
import {AttributeBroker} from "#customary/attributes/AttributeBroker.js";
import {CustomaryLitElement} from "#customary/lit/CustomaryLitElement.js";

export class CustomaryRegistry {
    constructor(private readonly customElementRegistry: CustomElementRegistry) {}

    async define<T extends HTMLElement>(
        name: string,
        constructor: CustomElementConstructor,
        definition: CustomaryDefinition<T>,
        dom_ElementDefinitionOptions: dom_ElementDefinitionOptions = {}
    ): Promise<CustomElementConstructor> {
        this.register(constructor, definition);
        return await this.defineOne(name, constructor, dom_ElementDefinitionOptions);
    }

    register(
        constructor: CustomElementConstructor,
        definition: CustomaryDefinition<any>
    ) {
        this.map.set(constructor, definition);
    }

    private async defineOne(
        name: string,
        constructor: CustomElementConstructor,
        dom_ElementDefinitionOptions: ElementDefinitionOptions
    ) {
        AttributeBroker.apply(
            constructor as typeof CustomaryLitElement,
            this.get(constructor)
        );
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
