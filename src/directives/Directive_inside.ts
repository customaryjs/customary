export class Directive_inside
{
	static hydrate(template: HTMLTemplateElement) {
		this.hydrateTree(template.content, template);
	}

	private static hydrateTree(node: ParentNode, template: HTMLTemplateElement)
	{
		while (true) {
			const markup = node.querySelector('inside--');
			if (!markup) return;

			this.hydrateTree(markup, template);

			const selectors = markup.getAttribute('target');
			if (!selectors) {
				throw new Error('Attribute "target" is required for "inside--" markup');
			}

			const target = node.querySelector(selectors);
			if (!target) {
				throw new Error(`No element matching ${selectors}`);
			}

			target.innerHTML = markup.innerHTML;

			markup.parentNode!.removeChild(markup);
		}
	}
}