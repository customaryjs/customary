// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomaryDefine} from "customary/CustomaryDefine.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomaryConstruct} from "customary/CustomaryConstruct.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomaryOptions} from "customary/CustomaryOptions.js";
import {CustomaryHTMLElement} from "customary/CustomaryHTMLElement.js";
import {CustomaryRegistry} from "customary/CustomaryRegistry.js";
import {CustomaryCustomElementConstructor} from "customary/CustomaryCustomElementConstructor.js";

export class Customary {

    static async define<T extends HTMLElement>(
        constructor: CustomaryCustomElementConstructor<any>,
        options?: Partial<CustomaryOptions<T>>
    ): Promise<CustomElementConstructor> {
        const customaryDefine = new CustomaryDefine<T>(
            this.registry, constructor, options);
        return await customaryDefine.define();
    }

    static construct(element: Element){
        const customaryDefinition =
            this.registry.get(element.constructor as CustomElementConstructor)!;
        new CustomaryConstruct().construct(element, customaryDefinition);
    }

    static observedAttributes(constructor: CustomElementConstructor): string[] | undefined {
        const customaryDefinition = this.registry.get(constructor)!;
        const {attributeOptions} = customaryDefinition;
        return attributeOptions ? Object.keys(attributeOptions.attributes) : undefined;
    }

    static attributeChangedCallback(
        element: Element, property: string, oldValue: string, newValue: string) {
        const customaryDefinition =
            this.registry.get(element.constructor as CustomElementConstructor)!;
        customaryDefinition.attributeOptions!.attributes[property]?.attributeChangedCallback(
            element, property, oldValue, newValue);
    }

    private static readonly registry = new CustomaryRegistry();

}

export {CustomaryOptions, CustomaryHTMLElement};