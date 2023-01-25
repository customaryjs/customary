// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomElementAssemblyInstruction} from "./CustomElementAssemblyInstruction.js";

export class CustomElementAssembler {

    async assemble(
        element: Element,
        customElementAssemblyInstruction: CustomElementAssemblyInstruction,
        options: {
            adoptStylesheetDont?: boolean;
            attachShadowDont?: boolean;
            replaceChildrenDont?: boolean;
            onDocumentFragment?: (documentFragment: DocumentFragment) => void;
        } = {}
    ){
        this.attachShadow(element, options.attachShadowDont);
        const documentFragment: DocumentFragment = customElementAssemblyInstruction.documentFragment.cloneNode(true) as DocumentFragment;
        options.onDocumentFragment?.(documentFragment);
        this.replaceChildren(
            element, documentFragment, options.replaceChildrenDont);
        this.adoptStylesheet(
            element, customElementAssemblyInstruction.cssStylesheet, options.adoptStylesheetDont);
    }

    //
    // DO NOT MAKE async
    //
    private attachShadow(
        element: Element,
        attachShadowDont?: boolean
    ) {
        if (attachShadowDont) return;
        element.attachShadow({mode: "open"});
    }

    private replaceChildren(
        element: Element,
        node: Node,
        replaceChildrenDont?: boolean
    ) {
        if (replaceChildrenDont) return;

        const parent: ParentNode = element.shadowRoot ?? element;
        parent.replaceChildren(node);
    }

    private adoptStylesheet(
        element: Element,
        cssStylesheet?: CSSStyleSheet,
        adoptStylesheetDont?: boolean
    ) {
        if (adoptStylesheetDont) return;
        if (!cssStylesheet) return;
        const adopter: DocumentOrShadowRoot = element.shadowRoot ?? document;
        adopter.adoptedStyleSheets.push(cssStylesheet);
    }

}