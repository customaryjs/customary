import {CustomaryDefinition} from "customary/CustomaryDefinition.js";

export class CustomaryRegistry {
    constructor(private readonly customElementRegistry: CustomElementRegistry) {
    }

    async define(name: string, customElementConstructor: CustomElementConstructor, definition: CustomaryDefinition, options?: ElementDefinitionOptions): Promise<CustomElementConstructor> {
        this.map.set(customElementConstructor, definition);
        this.customElementRegistry.define(name, customElementConstructor, options);
        return await this.customElementRegistry.whenDefined(name);
    }

    get(customElementConstructor: CustomElementConstructor): CustomaryDefinition {
        return this.map.get(customElementConstructor) ?? (() => {
            throw new Error()
        })();
    }

    private readonly map: Map<CustomElementConstructor, CustomaryDefinition> = new Map();
}
