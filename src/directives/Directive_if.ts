import {set_outerHTML} from "./set_outerHTML.js";

export class Directive_if
{
	static hydrate(template: HTMLTemplateElement) {
		this.hydrateTree(template.content, template);
	}

	private static hydrateTree(node: ParentNode, template: HTMLTemplateElement)
	{
		while (true) {
			const tag = node.querySelector('if--');
			if (!tag) return;

			this.hydrateTree(tag, template);

			const condition = tag.getAttribute('condition') ??
					(()=>{
						throw Error('Attribute "condition" is required for "if--" markup')
					})();

			const trueElements = [...tag.querySelectorAll(':scope > true--')];
			if (trueElements.length > 1) {
				throw Error('Only one "true--" is allowed for "if--" markup');
			}
			const trueElement: Element | undefined = trueElements[0];

			const falseElements = [...tag.querySelectorAll(':scope > false--')];
			if (falseElements.length > 1) {
				throw Error('Only one "false--" is allowed for "if--" markup');
			}
			const falseElement: Element | undefined = falseElements[0];

			if (falseElement && !trueElement) {
				throw Error('One "true" is required if "false" present for "if--" markup');
			}

			const trueCase = `() => html\`${trueElement?.innerHTML ?? tag.innerHTML}\``;

			const falseCase = falseElement ? `, () => html\`${falseElement.innerHTML}\`` : '';

			const directive = `\${when(${condition}, ${trueCase}${falseCase})}`;

			set_outerHTML(tag, directive, template);
		}
	}
}