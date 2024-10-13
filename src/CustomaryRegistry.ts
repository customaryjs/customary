import {CustomaryDefinition} from "customary/CustomaryDefinition.js";

export class CustomaryRegistry {
    constructor(private readonly customElementRegistry: CustomElementRegistry) {}

    async define<T extends HTMLElement>(
        name: string,
        customElementConstructor: CustomElementConstructor,
        definition: CustomaryDefinition<T>,
        options?: ElementDefinitionOptions
    ): Promise<CustomElementConstructor> {
        this.map.set(customElementConstructor, definition);
        this.customElementRegistry.define(name, customElementConstructor, options);
        return await this.customElementRegistry.whenDefined(name);
    }

    get<T extends HTMLElement>(customElementConstructor: CustomElementConstructor): CustomaryDefinition<T> {
        return this.map.get(customElementConstructor) ?? (() => {
            throw new Error()
        })();
    }

    private readonly map: Map<CustomElementConstructor, CustomaryDefinition<any>> = new Map();
}
