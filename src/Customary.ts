// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomaryDefine} from "customary/CustomaryDefine.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomaryDefinition} from "customary/CustomaryDefinition.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomaryConstruct} from "customary/CustomaryConstruct.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomaryOptions} from "customary/CustomaryOptions.js";
import {CustomaryRegistry} from "customary/CustomaryRegistry.js";
import {CustomaryCustomElementConstructor} from "customary/CustomaryCustomElementConstructor.js";

export class Customary {

    static async define<T extends HTMLElement>(
        ...constructors: CustomaryCustomElementConstructor<any>[]
    ): Promise<CustomElementConstructor> {
        const customaryDefine = new CustomaryDefine<T>(
            this.registry, constructors[0]);
        return await customaryDefine.define();
    }

    static construct(element: Element){
        const customaryDefinition =
            this.registry.get(element.constructor as CustomElementConstructor)!;
        new CustomaryConstruct().construct(element, customaryDefinition);
    }

    static observedAttributes(constructor: CustomElementConstructor): string[] {
        const customaryDefinition = this.registry.get(constructor)!;
        return Object.keys(customaryDefinition.attributeOptions!.attributes);
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

export {CustomaryOptions};