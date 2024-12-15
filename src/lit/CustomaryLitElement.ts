import {LitElement} from "lit-for-customary";
import {Mixin_attributeChange} from "#customary/attributes/Mixin_attributeChange.js";
import {Mixin_addEventHandlers} from "#customary/events/Mixin_addEventHandlers.js";
import {Mixin_firstUpdated} from "#customary/lifecycle/firstUpdated/Mixin_firstUpdated.js";
import {Mixin_renderFromTemplate} from "#customary/render/Mixin_renderFromTemplate.js";
import {Mixin_slotChange} from "#customary/slots/Mixin_slotChange.js";
import {Mixin_connected} from "#customary/lifecycle/connected/Mixin_connected.js";
import {Mixin_disconnected} from "#customary/lifecycle/disconnected/Mixin_disconnected.js";
import {Mixin_adoptStyleSheet} from "#customary/style/Mixin_adoptStyleSheet.js";
import {Mixin_updated} from "#customary/lifecycle/updated/Mixin_updated.js";
import {Mixin_state} from "#customary/state/Mixin_state.js";

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
				Mixin_state(
				Mixin_updated(
						LitElement
				))))))))))
{
	static properties: Record<PropertyKey, any> = {};
}
