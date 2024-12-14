import {CustomaryLit} from "#customary/lit/CustomaryLit.js";
import {LitElement} from "lit-for-customary";
import {CustomaryStateBroker} from "#customary/state/CustomaryStateBroker.js";
import {Mixin_attributeChange} from "#customary/attributes/Mixin_attributeChange.js";
import {Mixin_addEventHandlers} from "#customary/events/Mixin_addEventHandlers.js";
import {Mixin_firstUpdated} from "#customary/lifecycle/firstUpdated/Mixin_firstUpdated.js";
import {Mixin_renderFromTemplate} from "#customary/render/Mixin_renderFromTemplate.js";
import {Mixin_slotChange} from "#customary/slots/Mixin_slotChange.js";
import {Mixin_connected} from "#customary/lifecycle/connected/Mixin_connected.js";
import {Mixin_disconnected} from "#customary/lifecycle/disconnected/Mixin_disconnected.js";
import {Mixin_adoptStyleSheet} from "#customary/style/Mixin_adoptStyleSheet.js";
import {Mixin_updated} from "#customary/lifecycle/updated/Mixin_updated.js";

export class CustomaryLitElement
		extends
				Mixin_addEventHandlers(
				Mixin_adoptStyleSheet(
				Mixin_attributeChange(
				Mixin_connected(
				Mixin_disconnected(
				Mixin_firstUpdated(
				Mixin_renderFromTemplate(
				Mixin_slotChange(
				Mixin_updated(
						LitElement
				)))))))))
{
	constructor() {
		super();
		(this as any).state = CustomaryLit.getCustomaryDefinition(this).state;
	}

	setState(state_or_fn: any) {
		CustomaryStateBroker.setState(
				state_or_fn,
				() => (this as any).state,
				state => (this as any).state = state
		);
	}

	static properties: Record<PropertyKey, any> = {
		state: {}
	};
}
