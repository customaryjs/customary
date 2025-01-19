import {PropertyDeclaration} from "@lit/reactive-element";
import {dom_ElementDefinitionOptions} from "#customary/dom/dom_ElementDefinitionOptions";

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
	changes?:
			Array<
					{
						name: string,
						willUpdate?: (el: T, a: any, z: any) => void;
						firstUpdated?: (el: T, a: any, z: any) => void;
						updated?: (el: T, a: any, z: any) => void;
					}
			>
			|
			Record<
				string,
				(el: T, a: any, z: any) => void
			>;
	externalLoader?: {
		import_meta?: ImportMeta;
		css_dont?: boolean;
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
	}
	slots?: {
		slotchange?: (el: T, event?: Event) => void;
	}
	dom?: {
		define?: {
			options?: dom_ElementDefinitionOptions,
		}
		attributeChangedCallback?: (el: T, name: string, oldValue: string | null, newValue: string | null) => void;
	}
}

type PropertyValues = Map<PropertyKey, unknown>;

type State = any;
type View = any;
