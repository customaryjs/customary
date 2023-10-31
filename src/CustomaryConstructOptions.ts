export type CustomaryConstructOptions<T extends HTMLElement> = {
    adoptStylesheetDont?: boolean;
    attachShadowDont?: boolean;
    replaceChildrenDont?: boolean;
    onConstruct?: (element: T, documentFragment: DocumentFragment) => void;
}