export class AddEventListener {
    constructor
    (
        private readonly options: {
            customElement: HTMLElement,
            selector?: string,
            type: string | undefined,
            listener: (el: HTMLElement, e: Event, t: EventTarget) => void,
        }
    ) {}

    execute() {
        const {customElement, listener} = this.options;
        const selector: string | undefined = this.options.selector;
        const type = this.options.type ?? DEFAULT_EVENT_TYPE;

        if (!selector) {
            customElement.addEventListener(
                type,
                (event: Event) => listener(customElement, event, event.target!)
            );
            return;
        }

        customElement.addEventListener(
            type,
            (event: Event) => this.doIfEventDelegationMatches(event, selector, listener, customElement)
        );
    }

    private doIfEventDelegationMatches(
        event: Event,
        selector: string,
        listener: (el: HTMLElement, e: Event, target: EventTarget) => void,
        customElement: HTMLElement
    ) {
        const composedPath = event.composedPath();

        const target = composedPath[0];

        const matchesEventDelegation =
            target instanceof Element
                ? !!target.closest(selector)
                : false;

        if (matchesEventDelegation) {
            listener(customElement, event, target);
        }
    }
}

const DEFAULT_EVENT_TYPE = 'click';
