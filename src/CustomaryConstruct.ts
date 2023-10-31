// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomaryDefinition} from "./CustomaryDefinition.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomarySlotOptions} from "customary/CustomarySlotOptions.js";

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

        this.addEventListener_slotChange(element, customaryDefinition.slotOptions);
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

    private addEventListener_slotChange(element: Element, slotOptions?: CustomarySlotOptions<any>) {
        if (!slotOptions) return;

        slotOptions.slotchange(element);

        /*
        https://stackoverflow.com/questions/67332635/slots-does-not-work-on-a-html-web-component-without-shadow-dom
        */
        element.shadowRoot!.addEventListener(
            'slotchange', event => slotOptions.slotchange(element, event));
    }
}