import {set_outerHTML} from "./set_outerHTML.js";
import {toSelector} from "#customary/markup/toSelector.js";
import {expandMarkupExpression} from "#customary/html/CustomaryHtml.js";

export class Markup_if
{
	static hydrate(template: HTMLTemplateElement) {
		this.hydrateTree(template.content, template);
	}

	private static hydrateTree(node: ParentNode, template: HTMLTemplateElement)
	{
		while (true) {
			const tag = node.querySelector(toSelector(if_markup));
			if (!tag) return;

			this.hydrateTree(tag, template);

			const condition = expandMarkupExpression(tag.getAttribute('condition') ??
					(()=>{
						throw Error(`Attribute "condition" is required for "${if_markup}" markup`)
					})());

			const trueElements = [...tag.querySelectorAll(`:scope > ${toSelector(true_markup)}`)];
			if (trueElements.length > 1) {
				throw Error(`Only one "${true_markup}" is allowed for "${if_markup}" markup`);
			}
			const trueElement: Element | undefined = trueElements[0];

			const falseElements = [...tag.querySelectorAll(`:scope > ${toSelector(false_markup)}`)];
			if (falseElements.length > 1) {
				throw Error(`Only one "${false_markup}" is allowed for "${if_markup}" markup`);
			}
			const falseElement: Element | undefined = falseElements[0];

			if (falseElement && !trueElement) {
				throw Error(`One "${true_markup}" is required if "${false_markup}" present for "${if_markup}" markup`);
			}

			const trueCase = `() => customary_lit_html_track( html\`${trueElement?.innerHTML ?? tag.innerHTML}\` )`;

			const falseCase = falseElement ? `, () => customary_lit_html_track( html\`${falseElement.innerHTML}\` )` : '';

			const directive = `\${when(${condition}, ${trueCase}${falseCase})}`;

			set_outerHTML(tag, directive, template);
		}
	}
}
const if_markup = 'customary:if';
const false_markup = 'customary:false';
const true_markup = 'customary:true';
