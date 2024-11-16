import {CustomaryDefinition} from "#customary/CustomaryDefinition.js";
import {CustomaryHTMLElement} from "#customary/html/CustomaryHTMLElement.js";
import {SlotHooks} from "#customary/CustomaryHooks.js";
import {EventConnector} from "#customary/events/EventConnector.js";

export class CustomaryConstruct<T extends HTMLElement> {

    construct(element: T, customaryDefinition: CustomaryDefinition<T>){
        const {config, documentFragment, hooks, state, cssStyleSheet}
            = customaryDefinition;

        if (!config?.construct?.attachShadowDont) {
            element.attachShadow({mode: "open"});
        }

        this.useDocumentFragment(
            element,
            documentFragment.cloneNode(true) as DocumentFragment,
            {
                onConstruct: hooks?.construct?.onConstruct,
                replaceChildrenDont: config?.construct?.replaceChildrenDont
            });

        this.initStateBind(element, state);

        this.adoptStylesheet(element, cssStyleSheet, config?.construct?.adoptStylesheetDont);

        this.addEventListener_slotChange(element, hooks?.slots);

        new EventConnector<T>().addEvents(element, hooks?.events);
    }

    private useDocumentFragment(
        element: T,
        documentFragment: DocumentFragment,
        options: {
            onConstruct? : (element: T, documentFragment: DocumentFragment) => void;
            replaceChildrenDont?: boolean;
        }
    ) {
        options.onConstruct?.(element, documentFragment);

        if (!options.replaceChildrenDont) {
            const parent: ParentNode = element.shadowRoot ?? element;
            parent.replaceChildren(documentFragment);
        }
    }

    private initStateBind(element: Element, state: object | object[] | undefined) {
        if (!(element instanceof CustomaryHTMLElement)) return;
        if (state === undefined) return;
        void element.setState(state);
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

    private addEventListener_slotChange(element: Element, slotHooks?: SlotHooks<any>) {
        const slotchange = slotHooks?.slotchange;
        if (!slotchange) return;

        slotchange(element);

        /*
        https://stackoverflow.com/questions/67332635/slots-does-not-work-on-a-html-web-component-without-shadow-dom
        */
        element.shadowRoot!.addEventListener('slotchange', event => slotchange(element, event));
    }

}