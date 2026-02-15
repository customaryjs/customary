import {set_outerHTML} from "./set_outerHTML.js";
import {toSelector} from "#customary/markup/toSelector.js";
import {expandMarkupExpression} from "#customary/html/CustomaryHtml.js";

export class Markup_for
{
	static hydrate(template: HTMLTemplateElement) {
		this.hydrateTree(template.content, template);
	}

	private static hydrateTree(node: ParentNode, template: HTMLTemplateElement)
	{
		while (true) {
			const tag = node.querySelector(toSelector(for_markup));
			if (!tag) return;

			this.hydrateTree(tag, template);

			const items_raw = tag.getAttribute('items') ??
					(()=>{
						throw Error(`Attribute "items" is required for "${for_markup}" markup`)
					})();

			const items = expandMarkupExpression(items_raw);

			const value = tag.getAttribute('value') ?? 'value';

			const index = tag.getAttribute('index');
			const args = index ? `(${value}, ${index})` : value;

			const body = tag.innerHTML;

			const use_repeat_instead_of_map = true;
			const directive = use_repeat_instead_of_map
				? `\${repeat(${items}??[], ${args} => customary_lit_html_track( html\`${body}\` ) )}`
				: `\${map(${items}, ${args} => customary_lit_html_track( html\`${body}\` ) )}`
			;

			set_outerHTML(tag, directive, template);
		}
	}
}
const for_markup = 'customary:for';


