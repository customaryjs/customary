// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomaryDefine} from "customary/CustomaryDefine.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomaryDefinition} from "customary/CustomaryDefinition.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomaryConstruct} from "customary/CustomaryConstruct.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomarySpec} from "customary/CustomarySpec.js";

export class Customary {

    static async define(
        constructor: CustomElementConstructor,
        spec?: CustomarySpec
    ): Promise<CustomElementConstructor> {
        const customarySpec = spec || (constructor as any).customary as CustomarySpec;
        if (!customarySpec) {
            throw new Error(
                'Customary needs a spec. ' +
                'You can pass it to this function as a second argument, ' +
                'or declare it in your custom element class as a "customary" static attribute.')
        }
        const {name, defineOptions} = customarySpec;
        const customElementDefiner = new CustomaryDefine(
            name, customarySpec.import_meta, defineOptions, customarySpec.constructOptions);
        const customaryDefinition = await customElementDefiner.define();
        Customary.registry.set(constructor, customaryDefinition);
        customElements.define(name, constructor, defineOptions?.elementDefinitionOptions ?? {extends: 'div'});
        return await customElements.whenDefined(name);
    }

    static construct(
        element: Element
    ){
        const customaryDefinition =
            Customary.registry.get(element.constructor as CustomElementConstructor)!;
        new CustomaryConstruct().construct(element, customaryDefinition);
    }

    private static readonly registry = new Map<CustomElementConstructor, CustomaryDefinition>();

}

export {CustomarySpec};