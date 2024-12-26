import {PropertyDeclaration} from "@lit/reactive-element";

export type CustomaryHooks<T extends HTMLElement> = {
	properties?:
			Array<
					{
						name: string,
						propertyDeclaration?: PropertyDeclaration,
					}
			>
			|
			Record<
					string,
					PropertyDeclaration
			>;
	externalLoader?: {
		import_meta?: ImportMeta;
	}
	events?:
			Array<
					{
						selector?: string;
						type?: string;
						listener: (el: T, event: Event) => void;
					}
			>
			|
			Record<
					string,
					(el: T, event: Event) => void
			>;
	lifecycle?: {
		willUpdate?: (el: T, changedProperties: PropertyValues) => void;
		firstUpdated?: (el: T, changedProperties: PropertyValues) => void;
		updated?: (el: T, changedProperties: PropertyValues) => void;
		connected?: (el: T) => void;
		disconnected?: (el: T) => void;
		attributeChangedCallback?: (el: T, name: string, oldValue: string | null, newValue: string | null) => void,
	}
	slots?: {
		slotchange?: (el: T, event?: Event) => void;
	}
}

type PropertyValues = Map<PropertyKey, unknown>;

type State = any;
type View = any;
