export type CustomaryAttributeOptions<T extends HTMLElement> = {
    attributes: Record<string, CustomaryAttributeOption<T>>;
}

type CustomaryAttributeOption<T extends HTMLElement> = {
    attributeChangedCallback: Customary_attributeChangedCallback<T>;
}

type Customary_attributeChangedCallback<T extends HTMLElement> =
    (element: T, property: string, oldValue: string, newValue: string) => void;
