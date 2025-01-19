import {set_outerHTML} from "./set_outerHTML.js";

export class Directive_map
{
	static hydrate(template: HTMLTemplateElement) {
		this.hydrateTree(template.content, template);
	}

	private static hydrateTree(node: ParentNode, template: HTMLTemplateElement)
	{
		while (true) {
			const tag = node.querySelector('map--');
			if (!tag) return;

			this.hydrateTree(tag, template);

			const items = tag.getAttribute('items') ??
					(()=>{
						throw Error('Attribute "items" is required for "map--" markup')
					})();

			const value = tag.getAttribute('value') ?? 'value';

			const index = tag.getAttribute('index');
			const args = index ? `(${value}, ${index})` : value;

			const body = tag.innerHTML;

			const directive = `\${map(${items}, ${args} => html\`${body}\`)}`;

			set_outerHTML(tag, directive, template);
		}
	}

}