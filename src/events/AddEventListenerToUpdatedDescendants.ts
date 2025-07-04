import {addCustomEventListener, CustomaryListener} from "#customary/events/CustomaryEventHandlers.js";

export class AddEventListenerToUpdatedDescendants {
    constructor
    (
        private readonly options: {
            customElement: HTMLElement,
            selector: string,
            type: string | undefined,
            listener: CustomaryListener,
        }
    ) {}

    execute() {
        const {customElement, selector, type, listener} = this.options;
        const parent: ParentNode = customElement.shadowRoot ?? customElement;
        const elements: NodeListOf<Element> = parent.querySelectorAll(selector);
        for (const element of elements) {
            addCustomEventListener(customElement, element, type, listener);
        }
    }
}
