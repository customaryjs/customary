import {CustomaryEvent} from "customary/CustomaryTypes.js";

export type CustomaryHooks<T extends HTMLElement> = {
    attributes?: Record<string, Customary_attributeChangedCallback<T>>;
    constructHooks?: {
        onConstruct? : (element: T, documentFragment: DocumentFragment) => void;
    };
    defineHooks?: {
        fromHtml?: () => Promise<string>;
        onTile?: (tile: string) => Promise<any>;
    };
    events?: CustomaryEvent<T>[];
    slotHooks?: {
        slotchange: (element: T, event?: Event) => void;
    }
}

export type Customary_attributeChangedCallback<T extends HTMLElement> =
    (element: T, property: string, oldValue: string, newValue: string) => void;
