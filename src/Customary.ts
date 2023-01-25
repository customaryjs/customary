// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomElementDefiner} from "customary/CustomElementDefiner.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomElementAssemblyInstruction} from "customary/CustomElementAssemblyInstruction.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomElementAssembler} from "customary/CustomElementAssembler.js";

export class Customary {

    static async define(
        name: string,
        constructor: CustomElementConstructor,
        import_meta: ImportMeta,
        options: {
            elementDefinitionOptions?: ElementDefinitionOptions,
            fontLocations?: string[],
        } = {}
    ): Promise<CustomElementConstructor> {
        const customElementAssemblyInstruction = await new CustomElementDefiner().define(
            name, constructor, import_meta, options
        );
        Customary.registry.set(constructor, customElementAssemblyInstruction);
        customElements.define(name, constructor, options.elementDefinitionOptions ?? {extends: 'div'});
        return await customElements.whenDefined(name);
    }

    private static readonly registry = new Map<CustomElementConstructor, CustomElementAssemblyInstruction>();

    static async construct(
        element: Element,
        options: {
            adoptStylesheetDont?: boolean;
            attachShadowDont?: boolean;
            replaceChildrenDont?: boolean;
            onDocumentFragment?: (documentFragment: DocumentFragment) => void;
        } = {}
    ){
        return await new CustomElementAssembler().assemble(
            element, 
            Customary.registry.get(
                element.constructor as CustomElementConstructor)!,
            options
        );
    }
}