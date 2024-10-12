import {CustomaryDefine} from "customary/CustomaryDefine.js";
import {CustomaryConstruct} from "customary/CustomaryConstruct.js";
import {CustomaryOptions} from "customary/CustomaryOptions.js";
import {CustomaryCustomElementConstructor} from "customary/CustomaryCustomElementConstructor.js";
import {CustomaryHTMLElement} from "customary/CustomaryHTMLElement.js";
import {CustomaryRegistry} from "customary/CustomaryRegistry.js";
import {CustomaryDefinition} from "customary/CustomaryDefinition";

export class Customary {

    static async detect(): Promise<CustomElementConstructor[]> {
        const templates: NodeListOf<HTMLTemplateElement> = document.querySelectorAll("template[data-customary-name]");
        const promises: Promise<CustomElementConstructor>[] = [];
        for (const template of templates) {
            promises.push(this.define(template.getAttribute('data-customary-name')!));
        }
        return await Promise.all(promises);
    }

    static async define<T extends HTMLElement>(
        name: string,
        options?: Partial<CustomaryOptions<T>>
    ): Promise<CustomElementConstructor>
    static async define<T extends HTMLElement>(
        constructor: CustomElementConstructor,
        options?: Partial<CustomaryOptions<T>>
    ): Promise<CustomElementConstructor>
    static async define<T extends HTMLElement>(
        nameOrConstructor: string | CustomElementConstructor,
        options?: Partial<CustomaryOptions<T>>
    ): Promise<CustomElementConstructor | CustomElementConstructor[]>
    {
        const constructor = typeof nameOrConstructor === 'string'
            ? class EphemeralCustomaryHTMLElement extends CustomaryHTMLElement {}
            : nameOrConstructor;

        const customaryOptions = this.combineCustomaryOptions(
            typeof nameOrConstructor === 'string' ? nameOrConstructor : undefined,
            options,
            (constructor as CustomaryCustomElementConstructor<any>).customary
        );

        const name = customaryOptions.name ??
            (()=>{throw new Error('A name must be provided to define a custom element.')})();

        const definition: CustomaryDefinition = await new CustomaryDefine(
            customaryOptions as CustomaryOptions<any>
        ).define();

        const elementDefinitionOptions: ElementDefinitionOptions | undefined = this.getElementDefinitionOptions(
            {extends: customaryOptions.defineOptions?.extends}, constructor
        );

        return await this.customaryRegistry.define(name, constructor, definition, elementDefinitionOptions);
    }

    private static combineCustomaryOptions(
        nameFromDefine: string | undefined,
        customaryOptionsFromDefine: Partial<CustomaryOptions<any>> | undefined,
        customaryOptionsFromClass: Partial<CustomaryOptions<any>> | undefined
    ): Partial<CustomaryOptions<any>> {
        return {
            ...customaryOptionsFromClass,
            ...customaryOptionsFromDefine,
            ...(typeof nameFromDefine === 'string' ? {name: nameFromDefine} : {}),
        };

        /*
        if (!Object.keys(customaryOptions).length) {
            throw new Error(`
Customary needs options. You can provide them:
- as a parameter when calling "Customary.define()"
- as a static attribute "customary" of a custom element class.
`);
        }
         */
    }

    private static getElementDefinitionOptions(
        options: {
            extends?: string
        }, customElementConstructor: CustomElementConstructor
    ): ElementDefinitionOptions | undefined {
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

    static construct(element: Element){
        const customaryDefinition =
            this.customaryRegistry.get(element.constructor as CustomElementConstructor)!;
        new CustomaryConstruct().construct(element, customaryDefinition);
    }

    static observedAttributes(constructor: CustomElementConstructor): string[] | undefined {
        const customaryDefinition = this.customaryRegistry.get(constructor)!;
        const {attributeOptions} = customaryDefinition;
        return attributeOptions ? Object.keys(attributeOptions.attributes) : undefined;
    }

    static attributeChangedCallback(
        element: Element, property: string, oldValue: string, newValue: string) {
        const customaryDefinition =
            this.customaryRegistry.get(element.constructor as CustomElementConstructor)!;
        customaryDefinition.attributeOptions!.attributes[property]?.attributeChangedCallback(
            element, property, oldValue, newValue);
    }

    private static readonly customaryRegistry = new CustomaryRegistry(customElements);

}

export {CustomaryOptions};