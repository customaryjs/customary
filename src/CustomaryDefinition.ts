import {CustomaryHooks} from "#customary/CustomaryHooks.js";

export type CustomaryDefinition<T extends HTMLElement> = {
    config?: {
        construct?: {
            adoptStylesheetDont?: boolean;
            attachShadowDont?: boolean;
            replaceChildrenDont?: boolean;
        }
    };
    cssStyleSheet?: CSSStyleSheet;
    template: HTMLTemplateElement;
    documentFragment: DocumentFragment;
    hooks?: CustomaryHooks<T>;
    state?: object | object[];
}
