import {toSelector} from "#customary/markup/toSelector.js";

export class Markup_inside
{
	static hydrate(template: HTMLTemplateElement) {
		this.hydrateTree(template.content, template);
	}

	private static hydrateTree(node: ParentNode, template: HTMLTemplateElement)
	{
		while (true) {
			const markup = node.querySelector(toSelector(inside_markup));
			if (!markup) return;

			this.hydrateTree(markup, template);

			const selectors = markup.getAttribute('target');
			if (!selectors) {
				throw new Error(`Attribute "target" is required for "${inside_markup}" markup`);
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
const inside_markup = 'customary:inside';
