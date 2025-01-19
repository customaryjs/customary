import {set_outerHTML} from "./set_outerHTML.js";

export class Directive_when
{
	static hydrate(template: HTMLTemplateElement) {
		this.hydrateTree(template.content, template);
	}

	private static hydrateTree(node: ParentNode, template: HTMLTemplateElement)
	{
		while (true) {
			const tag = node.querySelector('when--');
			if (!tag) return;

			this.hydrateTree(tag, template);

			const condition = tag.getAttribute('condition') ??
					(()=>{
						throw Error('Attribute "condition" is required for "when--" markup')
					})();

			const trueElements = [...tag.querySelectorAll(':scope > true--')];
			if (trueElements.length > 1) {
				throw Error('Only one "true--" is allowed for "when--" markup');
			}
			const trueElement: Element | undefined = trueElements[0];

			const falseElements = [...tag.querySelectorAll(':scope > false--')];
			if (falseElements.length > 1) {
				throw Error('Only one "false--" is allowed for "when--" markup');
			}
			const falseElement: Element | undefined = falseElements[0];

			if (falseElement && !trueElement) {
				throw Error('One "true" is required if "false" present for "when--" markup');
			}

			const trueCase = `() => html\`${trueElement?.innerHTML ?? tag.innerHTML}\``;

			const falseCase = falseElement ? `, () => html\`${falseElement.innerHTML}\`` : '';

			const directive = `\${when(${condition}, ${trueCase}${falseCase})}`;

			set_outerHTML(tag, directive, template);
		}
	}
}