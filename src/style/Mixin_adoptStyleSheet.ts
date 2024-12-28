import {LitElement} from 'lit';
import {CustomaryRegistry} from "#customary/registry/CustomaryRegistry.js";

type Constructor<T = {}> = new (...args: any[]) => T;

export function Mixin_adoptStyleSheet
<T extends Constructor<LitElement>>(superClass: T): T {
	class Mixin_adoptStyleSheet_Class extends superClass {
		// noinspection JSUnusedGlobalSymbols
		override firstUpdated(changedProperties: Map<string, any>) {
			super.firstUpdated?.(changedProperties);

			const definition = CustomaryRegistry.getCustomaryDefinition(this);

			const {cssStyleSheet} = definition;
			if (!cssStyleSheet) return;

			const adopter: DocumentOrShadowRoot = this.shadowRoot ?? document;
			adopter.adoptedStyleSheets.push(cssStyleSheet);
		}
	}
	return Mixin_adoptStyleSheet_Class;
}
