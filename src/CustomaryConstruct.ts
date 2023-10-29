// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomaryDefinition} from "./CustomaryDefinition.js";

export class CustomaryConstruct {

    construct(element: Element, customaryDefinition: CustomaryDefinition){
        const options = customaryDefinition.constructOptions;

        if (!options?.attachShadowDont) {
            element.attachShadow({mode: "open"});
        }

        const documentFragment = customaryDefinition.documentFragment.cloneNode(true) as DocumentFragment;

        options?.onConstruct?.(element, documentFragment);

        if (!options?.replaceChildrenDont) {
            const parent: ParentNode = element.shadowRoot ?? element;
            parent.replaceChildren(documentFragment);
        }

        this.adoptStylesheet(element, customaryDefinition.cssStylesheet, options?.adoptStylesheetDont);
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