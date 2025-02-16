import {LitElement} from '#customary/lit';
import {getDefinition} from "#customary/CustomaryDefinition.js";

type Constructor<T = {}> = new (...args: any[]) => T;

export function Mixin_adoptStyleSheet
<T extends Constructor<LitElement>>(superClass: T): T {
	class Mixin_adoptStyleSheet_Class extends superClass {
		// noinspection JSUnusedGlobalSymbols
		override firstUpdated(changedProperties: Map<string, any>) {
			super.firstUpdated?.(changedProperties);

			const definition = getDefinition(this);

			const {cssStyleSheet} = definition;
			if (!cssStyleSheet) return;

			const adopter: DocumentOrShadowRoot = this.shadowRoot ?? document;
			adopter.adoptedStyleSheets.push(cssStyleSheet);
		}
	}
	return Mixin_adoptStyleSheet_Class;
}
