const DEFAULT_EVENT_TYPES: Record<string, string> = {
    'A': 'click',
    'BUTTON': 'click',
    'FORM': 'submit',
    'INPUT': 'input',
    'SELECT': 'input',
    'TABLE': 'click',
    'TEXTAREA': 'input',
}

export type CustomaryListener = (element: HTMLElement, event: Event) => void;

export function addCustomEventListener(
    customElement: HTMLElement,
    element: Element,
    type: string | undefined,
    listener: CustomaryListener
)
{
    const listeners: Array<CustomaryListener> =
        (element as any).__customary_listeners ??= [];
    if (listeners.includes(listener)) {
        return;
    }
    const tagName = element.tagName;
    element.addEventListener(
        type ??
        DEFAULT_EVENT_TYPES[tagName] ??
        (() => {
            throw new Error(
                `${customElement.tagName.toLowerCase()}: ${tagName} elements` +
                ' require you to provide an event type' +
                ' because Customary has not defined a default yet'
            );
        })(),
        (event: Event) => listener(customElement, event)
    );
    listeners.push(listener);
}

