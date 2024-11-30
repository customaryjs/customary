export type AttributeHooks<T extends HTMLElement> = Record<string, Customary_attributeChangedCallback<T>>;

export type Customary_attributeChangedCallback<T extends HTMLElement> =
		(element: T, name: string, oldValue: string | null, newValue: string | null) => void;
