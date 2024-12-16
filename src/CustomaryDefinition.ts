import {CustomaryHooks} from "#customary/CustomaryHooks.js";

export type CustomaryDefinition<T extends HTMLElement> = {
    config?: {
        construct?: {
            adoptStylesheetDont?: boolean;
            replaceChildrenDont?: boolean;
        }
    };
    cssStyleSheet?: CSSStyleSheet;
    template: HTMLTemplateElement;
    documentFragment: DocumentFragment;
    hooks?: CustomaryHooks<T>;
    state?: Record<string, object | object[]>;
}
