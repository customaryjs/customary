import {CustomaryLit} from "#customary/lit/CustomaryLit.js";
import {html, LitElement, map, state} from "lit-for-customary";
import {CustomaryHTML} from "#customary/html/CustomaryHTML.js";
import {CustomaryStateBroker} from "#customary/state/CustomaryStateBroker.js";

export class CustomaryLitElement extends LitElement {

	@state()
	private state: any;

	constructor() {
		super();
		this.state = CustomaryLit.getState(this);
	}

	setState(state_or_fn: any) {
		CustomaryStateBroker.setState(
				state_or_fn, () => this.state, state => this.state = state
		);
	}

	protected render(): unknown {
		if (!map) throw new Error("https://www.typescriptlang.org/docs/handbook/modules/reference.html#type-only-imports-and-exports");

		const template: HTMLTemplateElement = CustomaryLit.templateToRender(this);

		const interpolated = this.interpolateVariables(template);

		return html`${interpolated}`;
	}

	private interpolateVariables(template: HTMLTemplateElement) {
		const htmlFromTemplate = template.innerHTML;

		// if the template has Lit directives with arrow functions,
		// innerHTML will encode the '>' out of the '=>' so we need to decode it back
		const htmlWithLitDirectives = htmlFromTemplate.replace('=&gt;', '=>');

		const state = this.state;

		return eval(`html\`${htmlWithLitDirectives}\``);
	}

	connectedCallback(): void {
		super.connectedCallback();
		CustomaryHTML.connectedCallback(this);
	}

	async firstUpdated() {
		CustomaryLit.addEvents(this);
	}
}
