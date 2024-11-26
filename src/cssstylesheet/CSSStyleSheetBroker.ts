export class CSSStyleSheetBroker {
	static adoptStylesheet(
			element: Element,
			cssStylesheet?: CSSStyleSheet,
			adoptStylesheetDont?: boolean
	) {
		if (adoptStylesheetDont) return;
		if (!cssStylesheet) return;
		const adopter: DocumentOrShadowRoot = element.shadowRoot ?? document;
		adopter.adoptedStyleSheets.push(cssStylesheet);
	}
}