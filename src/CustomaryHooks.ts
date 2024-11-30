import {AttributeHooks} from "#customary/attributes/AttributeHooks.js";
import {Hook_firstUpdated} from "#customary/lifecycle/firstUpdated/Hook_firstUpdated";

export type CustomaryHooks<T extends HTMLElement> = {
    attributes?: AttributeHooks<T>;
    construct?: {
        onConstruct? : (element: T, documentFragment: DocumentFragment) => void;
    };
    define?: {
        fromHtml?: () => Promise<string>;
        onTile?: (tile: string) => Promise<any>;
    };
    externalLoader?: {
        import_meta?: ImportMeta;
    }
    events?: CustomaryEvents<T>;
    lifecycle?: {
        firstUpdated?: Hook_firstUpdated<T>;
        connected?: (element: T) => void;
        disconnected?: (element: T) => void;
        adopted?: (element: T) => void;
    }
    slots?: SlotHooks<T>;
}

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
