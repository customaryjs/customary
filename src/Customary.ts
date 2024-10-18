import {CustomaryDefine} from "customary/CustomaryDefine.js";
import {CustomaryConstruct} from "customary/CustomaryConstruct.js";
import {CustomaryOptions} from "customary/CustomaryOptions.js";
import {CustomaryHTMLElement} from "customary/CustomaryHTMLElement.js";
import {CustomaryRegistry} from "customary/CustomaryRegistry.js";
import {CustomaryDefinition} from "customary/CustomaryDefinition";
import {CustomaryHooks} from "customary/CustomaryHooks";

export class Customary {

    static readonly hooks: Record<string, CustomaryHooks<any>> = {};

    static async detect(): Promise<CustomElementConstructor[]> {
        const templates: NodeListOf<HTMLTemplateElement> = document.querySelectorAll("template[data-customary-name]");
        const promises: Promise<CustomElementConstructor>[] = [];
        for (const template of templates) {
            promises.push(this.define(template.getAttribute('data-customary-name')!));
        }
        return await Promise.all(promises);
    }

    private static detectState(name: string): object | object[] | undefined {
        const element = document.querySelector(
            `script[type="application/json"][data-customary-name='${name}']`
        );
        return element?.textContent ? JSON.parse(element.textContent) : undefined;
    }

    private static detectHooks<T extends HTMLElement>(name: string): CustomaryHooks<T> | undefined {
        return this.hooks[name];
    }

    static async define<T extends HTMLElement>(
        name: string,
        options?: Partial<CustomaryOptions>,
        hooks?: Partial<CustomaryHooks<T>>
    ): Promise<CustomElementConstructor>
    static async define<T extends HTMLElement>(
        constructor: CustomElementConstructor,
        options?: Partial<CustomaryOptions>,
        hooks?: Partial<CustomaryHooks<T>>
    ): Promise<CustomElementConstructor>
    static async define<T extends HTMLElement>(
        nameOrConstructor: string | CustomElementConstructor,
        options?: Partial<CustomaryOptions>,
        hooks?: Partial<CustomaryHooks<T>>
    ): Promise<CustomElementConstructor | CustomElementConstructor[]>
    {
        const constructor: CustomElementConstructor = typeof nameOrConstructor === 'string'
            ? class EphemeralCustomaryHTMLElement extends CustomaryHTMLElement {}
            : nameOrConstructor;

        const customaryOptions = this.combineCustomaryOptions(
            typeof nameOrConstructor === 'string' ? nameOrConstructor : undefined,
            options,
            (constructor as any)?.customary as CustomaryOptions
        );

        const name = customaryOptions.name ??
            (()=>{throw new Error('A name must be provided to define a custom element.')})();

        customaryOptions.state = this.combineState(name, customaryOptions?.state);

        const customaryHooks: CustomaryHooks<T> | undefined = this.combineHooks(name, hooks);

        const definition: CustomaryDefinition<T> = await new CustomaryDefine(
            customaryOptions as CustomaryOptions, customaryHooks
        ).define();

        const elementDefinitionOptions: ElementDefinitionOptions | undefined = this.getElementDefinitionOptions(
            {extends: customaryOptions.defineOptions?.extends}, constructor
        );

        return await this.customaryRegistry.define(name, constructor, definition, elementDefinitionOptions);
    }

    private static combineState(
        name: string,
        stateFromDefine: object | object[] | undefined,
    ): object | object[] | undefined {
        const stateDetected: object | object[] | undefined = this.detectState(name);
        const state = stateFromDefine ?? stateDetected;
        return state instanceof Array
            ? state
            : state && Object.keys(state).length
                ? state : undefined;
    }

    private static combineHooks<T extends HTMLElement>(
        name: string,
        customaryHooksFromDefine: Partial<CustomaryHooks<T>> | undefined
    ): CustomaryHooks<T> | undefined {
        const customaryHooksDetected: CustomaryHooks<T> | undefined = this.detectHooks(name);
        function o(data: Record<string, any>): object {
            const [, value] = Object.entries(data)[0];
            return value ? data : {};
        }
        function u(data: any): object | undefined {
            return Object.keys(data).length ? data: undefined;
        }
        return u({
            ...o({attributes: customaryHooksFromDefine?.attributes ?? customaryHooksDetected?.attributes}),
            ...o({constructHooks: customaryHooksFromDefine?.constructHooks ?? customaryHooksDetected?.constructHooks}),
            ...o({defineHooks: customaryHooksFromDefine?.defineHooks ?? customaryHooksDetected?.defineHooks}),
            ...o({events: customaryHooksFromDefine?.events ?? customaryHooksDetected?.events}),
            ...o({lifecycle: customaryHooksFromDefine?.lifecycle ?? customaryHooksDetected?.lifecycle}),
            ...o({slotHooks: customaryHooksFromDefine?.slotHooks ?? customaryHooksDetected?.slotHooks}),
        });
    }

    private static combineCustomaryOptions(
        nameFromDefine: string | undefined,
        customaryOptionsFromDefine: Partial<CustomaryOptions> | undefined,
        customaryOptionsFromClass: Partial<CustomaryOptions> | undefined
    ): Partial<CustomaryOptions> {
        return {
            ...customaryOptionsFromClass,
            ...customaryOptionsFromDefine,
            ...(typeof nameFromDefine === 'string' ? {name: nameFromDefine} : {}),
        };
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

    static construct<T extends HTMLElement>(element: T) {
        const customaryDefinition =
            this.customaryRegistry.get(element.constructor as CustomElementConstructor)!;
        new CustomaryConstruct().construct(element, customaryDefinition);
    }

    static connectedCallback<T extends HTMLElement>(element: T) {
        const constructor = element.constructor as CustomElementConstructor;
        const customaryDefinition = this.customaryRegistry.get(constructor)!;
        customaryDefinition.hooks?.lifecycle?.connected?.(element);
    }

    static disconnectedCallback<T extends HTMLElement>(element: T) {
        const constructor = element.constructor as CustomElementConstructor;
        const customaryDefinition = this.customaryRegistry.get(constructor)!;
        customaryDefinition.hooks?.lifecycle?.disconnected?.(element);
    }

    static adoptedCallback<T extends HTMLElement>(element: T) {
        const constructor = element.constructor as CustomElementConstructor;
        const customaryDefinition = this.customaryRegistry.get(constructor)!;
        customaryDefinition.hooks?.lifecycle?.adopted?.(element);
    }

    static observedAttributes(constructor: CustomElementConstructor): string[] | undefined {
        const customaryDefinition = this.customaryRegistry.get(constructor)!;
        const attributes = customaryDefinition.hooks?.attributes;
        return attributes ? Object.keys(attributes) : undefined;
    }

    static attributeChangedCallback<T extends HTMLElement>(
        element: T, property: string, oldValue: string, newValue: string
    ) {
        const constructor = element.constructor as CustomElementConstructor;
        const customaryDefinition = this.customaryRegistry.get(constructor)!;
        customaryDefinition.hooks?.attributes?.[property]?.(
            element, property, oldValue, newValue);
    }

    private static readonly customaryRegistry = new CustomaryRegistry(customElements);

}

export {CustomaryOptions};