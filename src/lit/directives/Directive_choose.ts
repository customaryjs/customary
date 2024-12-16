export class Directive_choose {

	static hydrate(template: HTMLTemplateElement) {
		const tags = template.content.querySelectorAll('choose--');
		for (const tag of tags) {
			const value = tag.getAttribute('value') ??
					(()=>{throw Error('Attribute "value" is required for "choose--" markup')})();
			const cases = this.toCases([...tag.querySelectorAll(':scope > case')]);
			const valueCases = cases.valueCases.join(',\n');
			const defaultCase = cases.defaultCase ? `,\n${cases.defaultCase}` : '';
			tag.outerHTML = `\${choose(${value},\n[${valueCases}]${defaultCase})}`;
		}
	}

	static toCases(cases: Element[]): {
		valueCases: string[];
		defaultCase?: string
	} {
		if (cases.length === 0) {
			throw Error('At least one "case" is required for "choose--" markup');
		}

		const defaultElements =
				cases.filter(caseElement => !caseElement.hasAttribute('value'));
		if (defaultElements.length > 1) {
			throw Error('Only one default "case" is allowed for "choose--" markup');
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