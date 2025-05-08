export function set_outerHTML(
		tag: Element, value: string, template: HTMLTemplateElement
) {
	try {
		tag.outerHTML = value;
	}
	catch (error: any) {
		const chrome =
				"Failed to set the 'outerHTML' property on 'Element': " +
				"This element's parent is of type '#document-fragment', which is not an element node.";
		if (error.message === chrome) {
			template.innerHTML = value;
		}
	}
}