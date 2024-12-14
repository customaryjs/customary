import {CustomaryLit} from "#customary/lit/CustomaryLit.js";
import {LitElement} from "lit-for-customary";
import {CustomaryStateBroker} from "#customary/state/CustomaryStateBroker.js";
import {AttributesMixin} from "#customary/attributes/AttributesMixin.js";
import {EventsMixin} from "#customary/events/EventsMixin.js";
import {Mixin_firstUpdated} from "#customary/lifecycle/firstUpdated/Mixin_firstUpdated.js";
import {Mixin_render} from "#customary/render/Mixin_render.js";

export class CustomaryLitElement
		extends AttributesMixin(EventsMixin(Mixin_firstUpdated(Mixin_render(LitElement))))
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

	override connectedCallback(): void {
		super.connectedCallback();
		CustomaryLit.connectedCallback(this);
	}

	override firstUpdated(changedProperties: Map<string, any>) {
		super.firstUpdated?.(changedProperties);
		CustomaryLit.adoptStyleSheet(this);
		CustomaryLit.addEventListener_slotChange(this);
	}

	static properties: Record<PropertyKey, any> = {
		state: {}
	};
}
