import {LitElement} from "lit-for-customary";
import {Mixin_addEventHandlers} from "#customary/events/Mixin_addEventHandlers.js";
import {Mixin_adoptStyleSheet} from "#customary/style/Mixin_adoptStyleSheet.js";
import {Mixin_attributeChangedCallback} from "#customary/attributes/Mixin_attributeChangedCallback.js";
import {Mixin_connected} from "#customary/lifecycle/connected/Mixin_connected.js";
import {Mixin_disconnected} from "#customary/lifecycle/disconnected/Mixin_disconnected.js";
import {Mixin_firstUpdated} from "#customary/lifecycle/firstUpdated/Mixin_firstUpdated.js";
import {Mixin_renderFromTemplate} from "#customary/render/Mixin_renderFromTemplate.js";
import {Mixin_slotChange} from "#customary/slots/Mixin_slotChange.js";
import {Mixin_state} from "#customary/state/Mixin_state.js";
import {Mixin_updated} from "#customary/lifecycle/updated/Mixin_updated.js";
import {Mixin_willUpdate} from "#customary/lifecycle/willUpdate/Mixin_willUpdate.js";
import {PropertyDeclaration} from "@lit/reactive-element";

export class CustomaryLitElement
		extends
				Mixin_addEventHandlers(
				Mixin_adoptStyleSheet(
				Mixin_attributeChangedCallback(
				Mixin_connected(
				Mixin_disconnected(
				Mixin_firstUpdated(
				Mixin_renderFromTemplate(
				Mixin_slotChange(
				Mixin_state(
				Mixin_updated(
				Mixin_willUpdate(
						LitElement
				)))))))))))
{
	static properties: Record<PropertyKey, PropertyDeclaration> = {};
}
