import {CustomaryRegistry} from "#customary/registry/CustomaryRegistry.js";
import {CustomaryEventBroker} from "#customary/events/CustomaryEventBroker.js";
import {CustomaryDefinition} from "#customary/CustomaryDefinition.js";
import {CSSStyleSheetBroker} from "#customary/cssstylesheet/CSSStyleSheetBroker.js";
import {SlotsBroker} from "#customary/slots/SlotsBroker.js";

export class CustomaryLit {

	public static adoptStyleSheet<T extends HTMLElement>(element: T) {
		const definition = this.getCustomaryDefinition(element);
		const {cssStyleSheet, config} = definition;
		CSSStyleSheetBroker.adoptStylesheet(
				element, cssStyleSheet, config?.construct?.adoptStylesheetDont
		);
	}

	public static addEventListener_slotChange<T extends HTMLElement>(element: T) {
		const definition = this.getCustomaryDefinition(element);
		SlotsBroker.addEventListener_slotChange(element, definition.hooks?.slots);
	}

	public static getState(element: HTMLElement): any {
		const definition = this.getCustomaryDefinition(element);
		return definition.state;
	}

	public static connectedCallback<T extends HTMLElement>(element: T) {
		const definition = this.getCustomaryDefinition(element);
		definition.hooks?.lifecycle?.connected?.(element);
	}

	public static getCustomaryDefinition(element: HTMLElement): CustomaryDefinition<HTMLElement> {
		const customaryRegistry = CustomaryRegistry.CustomaryRegistry_singleton;
		return customaryRegistry.get(element.constructor as CustomElementConstructor)!;
	}

}