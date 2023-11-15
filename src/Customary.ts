// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomaryDefine} from "customary/CustomaryDefine.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomaryDefinition} from "customary/CustomaryDefinition.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomaryConstruct} from "customary/CustomaryConstruct.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomaryOptions} from "customary/CustomaryOptions.js";

interface CustomaryCustomElementConstructor<T extends HTMLElement> extends CustomElementConstructor {
    customary?: CustomaryOptions<T>;
}

export class Customary {

    static async define<T extends HTMLElement>(
        constructor: CustomaryCustomElementConstructor<T>,
        options?: CustomaryOptions<T>
    ): Promise<CustomElementConstructor> {
        const customaryOptions = options || constructor.customary;
        if (!customaryOptions) {
            throw new Error(
                'Customary needs options. ' +
                'You can pass them to this function as a second argument, ' +
                'or declare them in your custom element class as a "customary" static attribute.')
        }
        const {name, defineOptions} = customaryOptions;
        const customaryDefine = new CustomaryDefine<T>(customaryOptions);
        const customaryDefinition = await customaryDefine.define();
        Customary.registry.set(constructor, customaryDefinition);
        customElements.define(name, constructor, defineOptions?.elementDefinitionOptions ?? {extends: 'div'});
        return await customElements.whenDefined(name);
    }

    static construct(element: Element){
        const customaryDefinition =
            Customary.registry.get(element.constructor as CustomElementConstructor)!;
        new CustomaryConstruct().construct(element, customaryDefinition);
    }

    static observedAttributes(constructor: CustomElementConstructor): string[] {
        const customaryDefinition = Customary.registry.get(constructor)!;
        return Object.keys(customaryDefinition.attributeOptions!.attributes);
    }

    static attributeChangedCallback(
        element: Element, property: string, oldValue: string, newValue: string) {
        const customaryDefinition =
            Customary.registry.get(element.constructor as CustomElementConstructor)!;
        customaryDefinition.attributeOptions!.attributes[property]?.attributeChangedCallback(
            element, property, oldValue, newValue);
    }

    private static readonly registry = new Map<CustomElementConstructor, CustomaryDefinition>();

}

export {CustomaryOptions};