export type CustomaryEvent = {
    selector: string;
    type?: string;
    listener: Function;
}

export type CustomaryConstructOptions<T extends HTMLElement> = {
    adoptStylesheetDont?: boolean;
    attachShadowDont?: boolean;
    replaceChildrenDont?: boolean;
    onConstruct?: (element: T, documentFragment: DocumentFragment) => void;
}

export type CustomaryAttributeOptions<T extends HTMLElement> = {
    attributes: Record<string, CustomaryAttributeOption<T>>;
}

type CustomaryAttributeOption<T extends HTMLElement> = {
    attributeChangedCallback: Customary_attributeChangedCallback<T>;
}

type Customary_attributeChangedCallback<T extends HTMLElement> =
    (element: T, property: string, oldValue: string, newValue: string) => void;

export type CustomarySlotOptions<T extends HTMLElement> = {
    slotchange: Customary_slotchange<T>;
}

type Customary_slotchange<T extends HTMLElement> = (element: T, event?: Event) => void;
