// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomaryDefine} from "customary/CustomaryDefine.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomaryConstruct} from "customary/CustomaryConstruct.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomaryOptions} from "customary/CustomaryOptions.js";
import {CustomaryCustomElementConstructor} from "customary/CustomaryCustomElementConstructor.js";
import {CustomaryDefinition} from "customary/CustomaryDefinition.js";

class CustomaryRegistry {
    constructor(private readonly customElementRegistry: CustomElementRegistry) {}

    async define(name: string, customElementConstructor: CustomElementConstructor, definition: CustomaryDefinition, options?: ElementDefinitionOptions): Promise<CustomElementConstructor> {
        this.map.set(customElementConstructor, definition);
        this.customElementRegistry.define(name, customElementConstructor, options);
        return await this.customElementRegistry.whenDefined(name);
    }

    get(customElementConstructor: CustomElementConstructor): CustomaryDefinition {
        return this.map.get(customElementConstructor) ?? (()=>{throw new Error()})();
    }

    private readonly map: Map<CustomElementConstructor, CustomaryDefinition> = new Map();
}

export class Customary {

    static async define(): Promise<CustomElementConstructor[]>
    static async define<T extends HTMLElement>(
        name: string,
        options?: Partial<CustomaryOptions<T>>
    ): Promise<CustomElementConstructor>
    static async define<T extends HTMLElement>(
        constructor: CustomaryCustomElementConstructor<any>,
        options?: Partial<CustomaryOptions<T>>
    ): Promise<CustomElementConstructor>
    static async define<T extends HTMLElement>(
        nameOrConstructor?: string | CustomaryCustomElementConstructor<any>,
        options?: Partial<CustomaryOptions<T>>
    ): Promise<CustomElementConstructor | CustomElementConstructor[]>
    {
        if (nameOrConstructor === undefined) {
            const templates: HTMLCollectionOf<HTMLTemplateElement> = document.getElementsByTagName("template");
            const promises: Promise<CustomElementConstructor>[] = [];
            for (const template of templates) {
                if (template.id) {
                    promises.push(Customary.define(template.id));
                }
            }
            return await Promise.all(promises);
        }

        const constructor = typeof nameOrConstructor === 'string'
            ? class EphemeralCustomaryHTMLElement extends CustomaryHTMLElement {}
            : nameOrConstructor;
        const customaryOptions = typeof nameOrConstructor === 'string' ? {name: nameOrConstructor} : options;

        const combinedOptions: CustomaryOptions<T> = Customary.getCustomaryOptions(constructor, customaryOptions);

        const definition = await new CustomaryDefine(combinedOptions).define();

        const elementDefinitionOptions = this.getElementDefinitionOptions(
            {extends: combinedOptions.defineOptions?.extends}, constructor
        );

        return await this.customaryRegistry.define(
            combinedOptions.name, constructor, definition, elementDefinitionOptions);
    }

    private static getCustomaryOptions(
        customElementConstructor: CustomElementConstructor,
        options?: Partial<CustomaryOptions<any>>) {
        const classOptions = (customElementConstructor as CustomaryCustomElementConstructor<any>).customary;
        if (!classOptions && !options) {
            throw new Error(
                'Customary needs options. ' +
                'Declare them in your custom element class as a "customary" static attribute.')
        }
        const customaryOptions: CustomaryOptions<any> = Object.assign({}, classOptions, options);
        if (customaryOptions.preset === "recommended") {
            customaryOptions.defineOptions ??= {};
            customaryOptions.defineOptions.resourceLocationResolution ??= {
                kind: "relative",
                pathPrefix: '../',
            };
        }
        return customaryOptions;
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

export class CustomaryHTMLElement extends HTMLElement {

    constructor() {
        super();
        Customary.construct(this);
    }

    static get observedAttributes() {
        return Customary.observedAttributes(this);
    }

    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    attributeChangedCallback(property: string, oldValue: string, newValue: string) {
        Customary.attributeChangedCallback(this, property, oldValue, newValue);
    }

}

export {CustomaryOptions};