import {CustomaryDefinition} from "customary/CustomaryDefinition.js";
import {CustomarySlotOptions} from "customary/CustomarySlotOptions.js";
import {CustomaryHTMLElement} from "customary/CustomaryHTMLElement.js";

export class CustomaryConstruct {

    construct(element: Element, customaryDefinition: CustomaryDefinition){
        const options = customaryDefinition.constructOptions;

        if (!options?.attachShadowDont) {
            element.attachShadow({mode: "open"});
        }

        const documentFragment = customaryDefinition.documentFragment.cloneNode(true) as DocumentFragment;

        options?.onConstruct?.(element, documentFragment);

        const parent: ParentNode = element.shadowRoot ?? element;

        if (!options?.replaceChildrenDont) {
            parent.replaceChildren(documentFragment);
        }

        this.setStateAndBind(element, customaryDefinition.state);

        this.adoptStylesheet(element, customaryDefinition.cssStyleSheet, options?.adoptStylesheetDont);

        this.addEventListener_slotChange(element, customaryDefinition.slotOptions);
    }

    private setStateAndBind(element: Element, state: object | object[] | undefined) {
        if (element instanceof CustomaryHTMLElement) {
            void element.stateful.setStateAndBind(element, state);
        }
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