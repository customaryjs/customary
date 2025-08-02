import {CustomaryDeclaration} from "#customary/CustomaryDeclaration.js";
import {AttributesDefinition} from "#customary/attributes/AttributesDefinition.js";

export type CustomaryDefinition<T extends HTMLElement> =
{
    readonly declaration: CustomaryDeclaration<T>;
    readonly attributes: AttributesDefinition;
    readonly templateInDocument: boolean;
    readonly immutable_htmlString: string;
}

export function hasDefinition(
    constructor: CustomElementConstructor
)
{
    return definition_property in constructor;
}

export function setDefinition<T extends HTMLElement>(
    constructor: CustomElementConstructor, definition: CustomaryDefinition<T>
)
{
    (constructor as any)[definition_property] = definition;
}

export function getDefinition<T extends HTMLElement>(element: T): CustomaryDefinition<T>
{
    const constructor = element.constructor;
    return (constructor as any)[definition_property] ?? (() => {
        throw new Error(`${constructor.name}: element never defined`)
    })();
}

const definition_property = 'customary_definition';
