export function findHTMLTemplateElementInDOMDocument(name: string): HTMLTemplateElement | undefined {
	return document.querySelector(`template[data-customary-name='${name}']`) as HTMLTemplateElement ?? undefined;
}
