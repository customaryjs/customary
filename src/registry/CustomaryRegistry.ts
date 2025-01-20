import {CustomaryDefinition, hasDefinition, setDefinition} from "#customary/CustomaryDefinition.js";
import {CustomaryDeclaration} from "#customary/CustomaryDeclaration.js";
import {CustomaryDefine} from "#customary/CustomaryDefine.js";

const WAIT_TO_DEFINE_EVERYTHING_IN_THE_END = false;

export class CustomaryRegistry
{
    static singleton(): CustomaryRegistry {
        return CustomaryRegistry.CustomaryRegistry_singleton
    }

    async declare(
        constructor: CustomElementConstructor,
        declaration: CustomaryDeclaration<any>
    ): Promise<void> {
        if (!declaration.name) {
            throw new Error('A name must be provided to define a custom element.');
        }

        if (!WAIT_TO_DEFINE_EVERYTHING_IN_THE_END) {
            await this.define(constructor, declaration);
            return;
        }

        this.declarations.set(constructor, declaration);
    }

    async settle(): Promise<void> {
        if (!WAIT_TO_DEFINE_EVERYTHING_IN_THE_END) {
            return;
        }

        const entries = [...this.declarations.entries()];

        const promises = entries.map(
            entry =>
            {
                const
                [
                    constructor, declaration
                ]: [
                CustomElementConstructor, CustomaryDeclaration<any>
            ] = entry;
                return this.define(constructor, declaration)
            }
        );

        await Promise.all(promises);
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
            console.debug(`${constructor.name}: element already defined, skipping...`);
            return;
        }

        const definition: CustomaryDefinition<T> =
            await new CustomaryDefine(declaration).define(constructor);

        setDefinition(constructor, definition);

        this.dom_customElementRegistry.define(
            declaration.name!, constructor,
            declaration.hooks?.dom?.define?.options
        );
    }

    constructor(private readonly dom_customElementRegistry: CustomElementRegistry) {}

    private readonly declarations: Map<CustomElementConstructor, CustomaryDeclaration<any>> = new Map();

    private static readonly CustomaryRegistry_singleton: CustomaryRegistry = new CustomaryRegistry(customElements);
}
