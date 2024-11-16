import {CustomaryLit} from "#customary/lit/CustomaryLit.js";
import {LitElement, html, map, state} from "lit-for-customary";

export class CustomaryLitElement extends LitElement {

	@state()
	private readonly state: any;

	constructor() {
		super();
		const definition = CustomaryLit.getCustomaryDefinition(this);
		this.state = definition.state;
	}

	protected render(): unknown {
		if (!map) throw new Error("https://www.typescriptlang.org/docs/handbook/modules/reference.html#type-only-imports-and-exports");

		const definition = CustomaryLit.getCustomaryDefinition(this);

		const template: HTMLTemplateElement = definition.template;

		const s = template.innerHTML.replace('&gt;', '>');

		const dom_node = eval(`html\`${s}\``);

		return html`${dom_node}`;

		/*
		const s = template.innerHTML;

		// https://stackoverflow.com/a/51012181/
		const a = [`${s}`] as any;
		a.raw = a;
		return html(a);
		 */
	}
}
