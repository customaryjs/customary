import {toSelector} from "#customary/markup/toSelector.js";

export class Markup_move_into
{
	static hydrate(template: HTMLTemplateElement) {
		this.hydrateTree(template.content, template);
	}

	private static hydrateTree(node: ParentNode, template: HTMLTemplateElement)
	{
		while (true) {
			const markup = node.querySelector(toSelector(move_into_markup));
			if (!markup) return;

			this.hydrateTree(markup, template);

			const selectors = markup.getAttribute('selector');
			if (!selectors) {
				throw new Error(`Attribute "selector" is required for "${move_into_markup}" markup`);
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
const move_into_markup = 'customary:move-into';
