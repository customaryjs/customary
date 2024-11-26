import {CustomaryLit} from "#customary/lit/CustomaryLit.js";
import {html, LitElement, map, state} from "lit-for-customary";
import {CustomaryStateBroker} from "#customary/state/CustomaryStateBroker.js";
import {AttributesMixin} from "#customary/attributes/AttributesMixin.js";
import {EventsMixin} from "#customary/events/EventsMixin.js";

export class CustomaryLitElement extends AttributesMixin(EventsMixin(LitElement)) {

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

		const templateResult = this.interpolateVariables(template, html);

		return html`${templateResult}`;
	}

	private interpolateVariables(template: HTMLTemplateElement, _html: any) {
		const htmlFromTemplate = template.innerHTML;

		// if the template has Lit directives with arrow functions,
		// innerHTML will encode the '>' out of the '=>' so we need to decode it back
		const htmlWithLitDirectives = htmlFromTemplate.replace('=&gt;', '=>');

		const state = this.state;
		const html = _html;

		const s: string = `html\`${htmlWithLitDirectives}\``;

		const templateResult = eval(s);

		return templateResult;
	}

	connectedCallback(): void {
		super.connectedCallback();
		CustomaryLit.connectedCallback(this);
	}

	firstUpdated(changedProperties: Map<string, any>) {
		super.firstUpdated?.(changedProperties);
		CustomaryLit.adoptStyleSheet(this);
		CustomaryLit.addEventListener_slotChange(this);
	}

	updated(changedProperties: Map<string, any>) {
		super.updated?.(changedProperties);
	}

	static properties: Record<PropertyKey, any> = {};
}
