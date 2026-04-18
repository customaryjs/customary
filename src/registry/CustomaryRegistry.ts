import {CustomaryDefinition, hasDefinition, setDefinition} from "#customary/CustomaryDefinition.js";
import {CustomaryDeclaration} from "#customary/CustomaryDeclaration.js";
import {CustomaryDefine} from "#customary/CustomaryDefine.js";
import {CustomaryProperties} from "#customary/CustomaryProperties.js";
import {LitElement} from "#customary/lit";

export class CustomaryRegistry
{
    async declare(
        constructor: CustomElementConstructor,
        declaration: CustomaryDeclaration<any>
    ): Promise<void> {
        if (!declaration.name) {
            throw new Error('A name must be provided to define a custom element.');
        }

        await this.define(constructor, declaration);
    }

    async untilDefined(constructor: CustomElementConstructor): Promise<CustomElementConstructor> {
        const name: string | undefined = (constructor as any).customary?.name;

        if (name === undefined) {
            throw new Error('Class must have the "customary" declaration with a "name" property.');
        }

        return await this.dom_customElementRegistry.whenDefined(name);
    }

    private async define<T extends HTMLElement>(
        constructor: CustomElementConstructor,
        declaration: CustomaryDeclaration<any>
    ): Promise<void>
    {
        if (hasDefinition(constructor)) {
            throw new Error(`${constructor.name}: element already defined`);
        }

        const definition: CustomaryDefinition<T> =
            await new CustomaryDefine(declaration).define();

        setDefinition(constructor, definition);

        CustomaryProperties.addProperties(constructor as typeof LitElement, definition);

        this.dom_customElementRegistry.define(
            declaration.name!, constructor,
            declaration.hooks?.dom?.define?.options
        );
    }

    constructor(private readonly dom_customElementRegistry: CustomElementRegistry) {}

}
