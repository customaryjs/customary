import {CustomaryEvent} from "customary/CustomaryTypes.js";
import {Customary_attributeChangedCallback} from "customary/CustomaryHooks.js";

export type CustomaryDefinition<T extends HTMLElement> = {
    documentFragment: DocumentFragment;
    cssStyleSheet: CSSStyleSheet | undefined;
    constructOptions: undefined | {
        adoptStylesheetDont: boolean | undefined;
        attachShadowDont: boolean | undefined;
        replaceChildrenDont: boolean | undefined;
    };
    state: object | object[] | undefined;
    hooks: undefined | {
        attributes: undefined | Record<string, Customary_attributeChangedCallback<T>>;
        constructHooks: undefined | {
            onConstruct: undefined | ((element: T, documentFragment: DocumentFragment) => void);
        };
        events: CustomaryEvent<T>[] | undefined,
        slotHooks: undefined | SlotHooks<T>,
    }
}

export type SlotHooks<T extends HTMLElement> = {
    slotchange: undefined | ((element: T, event?: Event) => void);
}
