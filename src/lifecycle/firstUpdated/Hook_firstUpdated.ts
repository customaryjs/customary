export type Hook_firstUpdated<T extends HTMLElement> =
		(element: T, changedProperties: PropertyValues) => void;

type PropertyValues = Map<PropertyKey, unknown>;
