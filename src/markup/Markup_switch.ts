import {set_outerHTML} from "./set_outerHTML.js";
import {toSelector} from "#customary/markup/toSelector.js";

export class Markup_switch
{
	static hydrate(template: HTMLTemplateElement)
	{
		this.hydrateTree(template.content, template);
	}

	private static hydrateTree(node: ParentNode, template: HTMLTemplateElement)
	{
		while (true) {
			const tag = node.querySelector(toSelector(switch_markup));
			if (!tag) return;

			this.hydrateTree(tag, template);

			const value = tag.getAttribute('value') ??
					(() => {
						throw Error(`Attribute "value" is required for "${switch_markup}" markup`)
					})();

			const cases = this.toCases([...tag.querySelectorAll(`:scope > ${toSelector(case_markup)}`)]);

			const valueCases = cases.valueCases.join(',\n');

			const defaultCase = cases.defaultCase ? `,\n${cases.defaultCase}` : '';

			const directive = `\${choose(${value},\n[${valueCases}]${defaultCase})}`;

			set_outerHTML(tag, directive, template);
		}
	}

	private static toCases(cases: Element[]): {
		valueCases: string[];
		defaultCase?: string
	} {
		if (cases.length === 0) {
			throw Error(`At least one "${case_markup}" is required for "${switch_markup}" markup`);
		}

		const defaultElements =
				cases.filter(caseElement => !caseElement.hasAttribute('value'));
		if (defaultElements.length > 1) {
			throw Error(`Only one default "${case_markup}" is allowed for "${switch_markup}" markup`);
		}
		const defaultElement = defaultElements[0];
		const defaultCase = `() => customary_lit_html_track( html\`${defaultElement?.innerHTML}\` )`;

		const valueElements =
				cases.filter(caseElement => caseElement.hasAttribute('value'));
		const valueCases = valueElements.map(caseElement => {
			const value = caseElement.getAttribute('value')!;
			return `['${value}', () => customary_lit_html_track( html\`${caseElement.innerHTML}\` ) ]`;
		})

		return {valueCases, defaultCase};
	}
}
const switch_markup = 'customary:switch';
const case_markup = 'customary:case';
