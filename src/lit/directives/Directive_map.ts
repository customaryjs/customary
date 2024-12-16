export class Directive_map {

	static hydrate(template: HTMLTemplateElement) {
		const tags = template.content.querySelectorAll('map--');
		for (const tag of tags) {
			const items = tag.getAttribute('items') ??
					(()=>{throw Error('Attribute "items" is required for "map--" markup')})();
			const value = tag.getAttribute('value') ?? 'value';
			const index = tag.getAttribute('index');
			const args = index ? `(${value}, ${index})` : value;
			const body = tag.innerHTML;
			tag.outerHTML = `\${map(${items}, ${args} => html\`${body}\`)}`;
		}
	}

}