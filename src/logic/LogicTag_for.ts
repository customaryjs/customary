import {set_outerHTML} from "./set_outerHTML.js";
import {toSelector} from "#customary/logic/toSelector.js";
import {expandCustomaryInterpolation} from "#customary/html/CustomaryHtml.js";

export class LogicTag_for
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

			const items_raw = tag.getAttribute('items') ??
					(()=>{
						throw Error(`Attribute "items" is required for "${tag_name}" tag`)
					})();

			const items = expandCustomaryInterpolation(items_raw);

			const value = tag.getAttribute('value') ?? 'value';

			const index = tag.getAttribute('index');
			const args = index ? `(${value}, ${index})` : value;

			const for_body = tag.querySelector(`:scope > ${toSelector(move_here_tag_name)}`);

			let body: string;
			if (for_body) {
				const selectors = for_body.getAttribute('selector') ??
						(()=>{ throw Error(`Attribute "selector" is required for "${move_here_tag_name}" tag`) })();
				const source = template.content.querySelector(selectors) ??
						(()=>{ throw Error(`No element matching ${selectors}`) })();
				body = source.outerHTML
					.replaceAll('<tr>', '&lt;tr&gt;')
					.replaceAll('</tr>', '&lt;/tr&gt;')
					.replaceAll('<td>', '&lt;td&gt;')
					.replaceAll('</td>', '&lt;/td&gt;');
				source.remove();
			} else {
				body = tag.innerHTML;
			}

			const use_repeat_instead_of_map = true;
			const directive = use_repeat_instead_of_map
				? `\${repeat(${items}??[], ${args} => customary_lit_html_track( html\`${body}\` ) )}`
				: `\${map(${items}, ${args} => customary_lit_html_track( html\`${body}\` ) )}`
			;

			set_outerHTML(tag, directive, template);
		}
	}
}
const tag_name = 'customary:for';
const move_here_tag_name = 'customary:move-here';


