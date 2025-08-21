export class AddEventListener {
    constructor
    (
        private readonly options: {
            customElement: HTMLElement,
            selector?: string,
            type: string | undefined,
            listener: (el: HTMLElement, e: Event) => void,
        }
    ) {}

    execute() {
        const {customElement, listener} = this.options;
        const selector: string | undefined = this.options.selector;
        const type = this.options.type ?? DEFAULT_EVENT_TYPE;

        if (!selector) {
            customElement.addEventListener(
                type,
                (event: Event) => listener(customElement, event)
            );
            return;
        }

        const eventContainer: ParentNode =
            customElement.shadowRoot ?? customElement;
        eventContainer.addEventListener(
            type,
            (event: Event) =>
                matchesEventDelegation(event, selector) &&
                listener(customElement, event)
        );
    }
}

function matchesEventDelegation(event: Event, selector: string): boolean {
    const target = event.target;
    return target instanceof Element ? !!target.closest(selector) : false;
}

const DEFAULT_EVENT_TYPE = 'click';