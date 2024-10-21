import {CustomaryDefinition} from "customary/CustomaryDefinition.js";
import {CustomaryHTMLElement} from "customary/CustomaryHTMLElement.js";
import {CustomaryEventListener, CustomaryEvents, SlotHooks} from "customary/CustomaryHooks.js";

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

        this.addEvents(element, hooks?.events);
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

    private addEvents(customElement: T, customaryEvents: CustomaryEvents<T> | undefined) {
        if (!customaryEvents) return;
        if (customaryEvents instanceof Array) {
            for (const customaryEvent of customaryEvents) {
                const selector = customaryEvent.selector;
                const type = customaryEvent.type;
                const listener = customaryEvent.listener;
                this.addEvent(customElement, selector, type, listener);
            }
            return;
        }
        for (const [selector, listener] of Object.entries(customaryEvents)) {
            const type = undefined;
            this.addEvent(customElement, selector, type, listener);
        }
    }

    private addEvent(
        customElement: T,
        selector: string,
        type: string | undefined,
        listener: CustomaryEventListener<T>
    ) {
        const parent: ParentNode = customElement.shadowRoot ?? customElement;
        const elements: NodeListOf<Element> = parent.querySelectorAll(selector);
        for (const element of elements) {
            element.addEventListener(
                type ?? getDefaultEventType(element),
                (event: Event) => listener(customElement, event)
            );
        }
    }
}

function getDefaultEventType(element: Element) {
    switch (element.tagName) {
        case 'BUTTON':
            return 'click';
    }
    throw new Error(`${element.tagName} elements require an event type as Customary hasn't defined a default yet`);
}