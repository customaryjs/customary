import {set_outerHTML} from "./set_outerHTML.js";

export class Directive_switch
{
	static hydrate(template: HTMLTemplateElement)
	{
		this.hydrateTree(template.content, template);
	}

	private static hydrateTree(node: ParentNode, template: HTMLTemplateElement)
	{
		while (true) {
			const tag = node.querySelector('switch--');
			if (!tag) return;

			this.hydrateTree(tag, template);

			const value = tag.getAttribute('value') ??
					(() => {
						throw Error('Attribute "value" is required for "switch--" markup')
					})();

			const cases = this.toCases([...tag.querySelectorAll(':scope > case--')]);

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
			throw Error('At least one "case--" is required for "choose--" markup');
		}

		const defaultElements =
				cases.filter(caseElement => !caseElement.hasAttribute('value'));
		if (defaultElements.length > 1) {
			throw Error('Only one default "case--" is allowed for "choose--" markup');
		}
		const defaultElement = defaultElements[0];
		const defaultCase = `() => html\`${defaultElement?.innerHTML}\``;

		const valueElements =
				cases.filter(caseElement => caseElement.hasAttribute('value'));
		const valueCases = valueElements.map(caseElement => {
			const value = caseElement.getAttribute('value')!;
			return `['${value}', () => html\`${caseElement.innerHTML}\`]`;
		})

		return {valueCases, defaultCase};
	}
}