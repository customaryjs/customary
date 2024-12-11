import {CustomaryLit} from "#customary/lit/CustomaryLit.js";
import {html, LitElement, map} from "lit-for-customary";
import {CustomaryStateBroker} from "#customary/state/CustomaryStateBroker.js";
import {AttributesMixin} from "#customary/attributes/AttributesMixin.js";
import {EventsMixin} from "#customary/events/EventsMixin.js";
import {Mixin_firstUpdated} from "#customary/lifecycle/firstUpdated/Mixin_firstUpdated.js";

export class CustomaryLitElement
		extends AttributesMixin(EventsMixin(Mixin_firstUpdated(LitElement)))
{
	constructor() {
		super();
		(this as any).state = CustomaryLit.getState(this);
	}

	setState(state_or_fn: any) {
		CustomaryStateBroker.setState(
				state_or_fn,
				() => (this as any).state,
				state => (this as any).state = state
		);
	}

	protected override render(): unknown {
		const template: HTMLTemplateElement = CustomaryLit.templateToRender(this);

		const templateResult = this.interpolateVariables(
				template, (this as any).state, html, map
		);

		return html`${templateResult}`;
	}

	private interpolateVariables(
			template: HTMLTemplateElement,
			_state: any,
			_html: any,
			_map: any
	) {
		const htmlFromTemplate = template.innerHTML;

		// if the template has Lit directives with arrow functions,
		// innerHTML will encode the '>' out of the '=>' so we need to decode it back
		const htmlWithLitDirectives = htmlFromTemplate.replace('=&gt;', '=>');

		const state = _state;
		const html = _html;
		const map = _map;

		const s: string = `html\`${htmlWithLitDirectives}\``;

		const templateResult = eval(s);

		return templateResult;
	}

	override connectedCallback(): void {
		super.connectedCallback();
		CustomaryLit.connectedCallback(this);
	}

	override firstUpdated(changedProperties: Map<string, any>) {
		super.firstUpdated?.(changedProperties);
		CustomaryLit.adoptStyleSheet(this);
		CustomaryLit.addEventListener_slotChange(this);
	}

	protected override updated(changedProperties: Map<string, any>) {
		super.updated?.(changedProperties);
	}

	static properties: Record<PropertyKey, any> = {
		state: {}
	};
}
