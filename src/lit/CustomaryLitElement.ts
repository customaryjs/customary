import {CustomaryLit} from "#customary/lit/CustomaryLit.js";
import {LitElement, html, map, state} from "lit-for-customary";
import {CustomaryHTML} from "#customary/html/CustomaryHTML.js";

export class CustomaryLitElement extends LitElement {

	@state()
	private state: any;

	constructor() {
		super();
		const definition = CustomaryLit.getCustomaryDefinition(this);
		this.state = definition.state ?? {};
	}

	setState(state: any) {
		this.state = state;
	}

	protected render(): unknown {
		if (!map) throw new Error("https://www.typescriptlang.org/docs/handbook/modules/reference.html#type-only-imports-and-exports");

		const definition = CustomaryLit.getCustomaryDefinition(this);

		const template: HTMLTemplateElement = definition.template;

		const htmlFromTemplate = template.innerHTML;

		// if the template has Lit directives with arrow functions,
		// innerHTML will encode the '>' out of the '=>' so we need to decode it back
		const htmlWithLitDirectives = htmlFromTemplate.replace('=&gt;', '=>');

		const resultWithVariablesInterpolated = eval(`html\`${htmlWithLitDirectives}\``);

		return html`${resultWithVariablesInterpolated}`;
	}

	connectedCallback(): void {
		super.connectedCallback();
		CustomaryHTML.connectedCallback(this);
	}
}
