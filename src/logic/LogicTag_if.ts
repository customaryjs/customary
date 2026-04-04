import {set_outerHTML} from "./set_outerHTML.js";
import {toSelector} from "#customary/logic/toSelector.js";
import {expandCustomaryInterpolation} from "#customary/html/CustomaryHtml.js";

export class LogicTag_if
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

			const condition = expandCustomaryInterpolation(tag.getAttribute('condition') ??
					(()=>{
						throw Error(`Attribute "condition" is required for "${tag_name}" tag`)
					})());

			const trueElements = [...tag.querySelectorAll(`:scope > ${toSelector(true_tag_name)}`)];
			if (trueElements.length > 1) {
				throw Error(`Only one "${true_tag_name}" is allowed for "${tag_name}" tag`);
			}
			const trueElement: Element | undefined = trueElements[0];

			const falseElements = [...tag.querySelectorAll(`:scope > ${toSelector(false_tag_name)}`)];
			if (falseElements.length > 1) {
				throw Error(`Only one "${false_tag_name}" is allowed for "${tag_name}" tag`);
			}
			const falseElement: Element | undefined = falseElements[0];

			if (falseElement && !trueElement) {
				throw Error(`One "${true_tag_name}" is required if "${false_tag_name}" present for "${tag_name}" tag`);
			}

			const trueCase = `() => customary_lit_html_track( html\`${trueElement?.innerHTML ?? tag.innerHTML}\` )`;

			const falseCase = falseElement ? `, () => customary_lit_html_track( html\`${falseElement.innerHTML}\` )` : '';

			const directive = `\${when(${condition}, ${trueCase}${falseCase})}`;

			set_outerHTML(tag, directive, template);
		}
	}
}
const tag_name = 'customary:if';
const false_tag_name = 'customary:false';
const true_tag_name = 'customary:true';
