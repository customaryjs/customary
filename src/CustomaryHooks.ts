export type CustomaryHooks<T extends HTMLElement> = {
    attributes?: Record<string, Customary_attributeChangedCallback<T>>;
    constructHooks?: {
        onConstruct? : (element: T, documentFragment: DocumentFragment) => void;
    };
    defineHooks?: {
        fromHtml?: () => Promise<string>;
        onTile?: (tile: string) => Promise<any>;
    };
    events?: CustomaryEvents<T>;
    lifecycle?: {
        connected?: (element: T) => void;
        disconnected?: (element: T) => void;
        adopted?: (element: T) => void;
    }
    slotHooks?: SlotHooks<T>;
}

type Customary_attributeChangedCallback<T extends HTMLElement> =
    (element: T, property: string, oldValue: string, newValue: string) => void;

export type CustomaryEvents<T extends HTMLElement> =
    CustomaryEvent<T>[] | Record<string, CustomaryEventListener<T>>;

export type CustomaryEvent<T extends HTMLElement> = {
    selector: string;
    type?: string;
    listener: CustomaryEventListener<T>;
}

export type CustomaryEventListener<T extends HTMLElement> =
    (element: T, event: Event) => void;

export type SlotHooks<T extends HTMLElement> = {
    slotchange?: (element: T, event?: Event) => void;
}
