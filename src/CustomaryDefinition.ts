import {CustomaryHooks} from "customary/CustomaryHooks.js";

export type CustomaryDefinition<T extends HTMLElement> = {
    constructOptions?: {
        adoptStylesheetDont?: boolean;
        attachShadowDont?: boolean;
        replaceChildrenDont?: boolean;
    };
    cssStyleSheet?: CSSStyleSheet;
    documentFragment: DocumentFragment;
    hooks?: CustomaryHooks<T>;
    state?: object | object[];
}
