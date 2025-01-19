import {CustomaryDeclaration} from "#customary/CustomaryDeclaration";

export type CustomaryDefinition<T extends HTMLElement> = {
    declaration: CustomaryDeclaration<T>;
    cssStyleSheet?: CSSStyleSheet;
    template: HTMLTemplateElement;
}
