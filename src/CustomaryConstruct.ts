import {CustomaryDefinition, SlotHooks} from "customary/CustomaryDefinition.js";
import {CustomaryHTMLElement} from "customary/CustomaryHTMLElement.js";
import {CustomaryEvent} from "customary/CustomaryTypes.js";

export class CustomaryConstruct<T extends HTMLElement> {

    construct(element: T, customaryDefinition: CustomaryDefinition<T>){
        const options = customaryDefinition.constructOptions;

        if (!customaryDefinition.constructOptions?.attachShadowDont) {
            element.attachShadow({mode: "open"});
        }

        const documentFragment = customaryDefinition.documentFragment.cloneNode(true) as DocumentFragment;

        customaryDefinition.hooks?.constructHooks?.onConstruct?.(element, documentFragment);

        const parent: ParentNode = element.shadowRoot ?? element;

        if (!customaryDefinition.constructOptions?.replaceChildrenDont) {
            parent.replaceChildren(documentFragment);
        }

        this.setStateAndBind(element, customaryDefinition.state);

        this.adoptStylesheet(element, customaryDefinition.cssStyleSheet, options?.adoptStylesheetDont);

        this.addEventListener_slotChange(element, customaryDefinition.hooks?.slotHooks);

        this.addEvents(element, customaryDefinition.hooks?.events);
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

    private addEventListener_slotChange(element: Element, slotHooks?: SlotHooks<any>) {
        const slotchange = slotHooks?.slotchange;
        if (!slotchange) return;

        slotchange(element);

        /*
        https://stackoverflow.com/questions/67332635/slots-does-not-work-on-a-html-web-component-without-shadow-dom
        */
        element.shadowRoot!.addEventListener('slotchange', event => slotchange(element, event));
    }

    private addEvents(customElement: T, customaryEvents: CustomaryEvent<T>[] | undefined) {
        if (!customaryEvents) return;

        const parent: ParentNode = customElement.shadowRoot ?? customElement;

        for (const customaryEvent of customaryEvents) {
            const elements: NodeListOf<Element> = parent.querySelectorAll(customaryEvent.selector);
            for (const element of elements) {
                element.addEventListener(
                    this.getEventType(customaryEvent, element)!,
                    (event: Event) => customaryEvent.listener(customElement, event)
                );
            }
        }
    }

    private getEventType(customaryEvent: CustomaryEvent<T>, element: Element): string | undefined {
        if (customaryEvent.type) return customaryEvent.type;
        switch (element.tagName) {
            case 'BUTTON': return 'click';
        }
        throw new Error(`${element.tagName} elements require an event type as Customary hasn't defined a default yet`);
    }
}