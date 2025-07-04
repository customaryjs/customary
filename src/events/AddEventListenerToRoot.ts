import {addCustomEventListener, CustomaryListener} from "#customary/events/CustomaryEventHandlers.js";

export class AddEventListenerToRoot {
    constructor(
        private readonly options:
        {
            customElement: HTMLElement,
            type: string,
            listener: CustomaryListener,
        }
    ) {}

    execute() {
        const {customElement, type, listener} = this.options;
        addCustomEventListener(customElement, customElement, type, listener);
    }
}
