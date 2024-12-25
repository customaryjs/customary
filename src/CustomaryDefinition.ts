import {CustomaryDeclaration} from "#customary/CustomaryOptions.js";

export type CustomaryDefinition<T extends HTMLElement> = {
    declaration: CustomaryDeclaration<T>;
    cssStyleSheet?: CSSStyleSheet;
    template: HTMLTemplateElement;
}
