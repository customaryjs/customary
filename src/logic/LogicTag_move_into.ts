import {toSelector} from "#customary/logic/toSelector.js";

export class LogicTag_move_into
{
	static hydrate(template: HTMLTemplateElement) {
		this.hydrateTree(template.content, template);
	}

	private static hydrateTree(node: ParentNode, template: HTMLTemplateElement)
	{
		while (true) {
			const tag = node.querySelector(toSelector(tag_name));
			if (!tag) return;

			this.hydrateTree(tag, template);

			const selectors = tag.getAttribute('selector');
			if (!selectors) {
				throw new Error(`Attribute "selector" is required for "${tag_name}" tag`);
			}

			const target = node.querySelector(selectors);
			if (!target) {
					throw new Error(`No element matching ${selectors}`);
			}

			target.innerHTML = tag.innerHTML;

			tag.parentNode!.removeChild(tag);
		}
	}
}
const tag_name = 'customary:move-into';
