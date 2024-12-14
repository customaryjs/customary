import {LitElement} from 'lit';
import {CustomaryLit} from "#customary/lit/CustomaryLit.js";

type Constructor<T = {}> = new (...args: any[]) => T;

export function Mixin_adoptStyleSheet
<T extends Constructor<LitElement>>(superClass: T): T {
	class Mixin_adoptStyleSheet_Class extends superClass {
		override firstUpdated(changedProperties: Map<string, any>) {
			super.firstUpdated?.(changedProperties);

			const definition = CustomaryLit.getCustomaryDefinition(this);

			if (definition.config?.construct?.adoptStylesheetDont) return;

			const {cssStyleSheet} = definition;
			if (!cssStyleSheet) return;

			const adopter: DocumentOrShadowRoot = this.shadowRoot ?? document;
			adopter.adoptedStyleSheets.push(cssStyleSheet);
		}
	}
	return Mixin_adoptStyleSheet_Class;
}
