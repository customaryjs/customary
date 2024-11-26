import {CustomaryDefinition} from "#customary/CustomaryDefinition.js";
import {CustomaryHTMLElement} from "#customary/html/CustomaryHTMLElement.js";
import {SlotHooks} from "#customary/CustomaryHooks.js";
import {CustomaryEventBroker} from "#customary/events/CustomaryEventBroker.js";
import {CSSStyleSheetBroker} from "#customary/cssstylesheet/CSSStyleSheetBroker.js";
import {SlotsBroker} from "#customary/slots/SlotsBroker";

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

        CSSStyleSheetBroker.adoptStylesheet(element, cssStyleSheet, config?.construct?.adoptStylesheetDont);

        SlotsBroker.addEventListener_slotChange(element, hooks?.slots);

        new CustomaryEventBroker<T>().addEvents(element, hooks?.events);
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

}