export type CustomaryConstructOptions = {
    adoptStylesheetDont?: boolean;
    attachShadowDont?: boolean;
    replaceChildrenDont?: boolean;
    onConstruct?: (element: Element, documentFragment: DocumentFragment) => void;
}