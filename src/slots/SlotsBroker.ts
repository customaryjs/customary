import {SlotHooks} from "#customary/CustomaryHooks";

export class SlotsBroker {
	static addEventListener_slotChange(element: Element, slotHooks?: SlotHooks<any>) {
		const slotchange = slotHooks?.slotchange;
		if (!slotchange) return;

		slotchange(element);

		/*
		https://stackoverflow.com/questions/67332635/slots-does-not-work-on-a-html-web-component-without-shadow-dom
		*/
		element.shadowRoot!.addEventListener('slotchange', event => slotchange(element, event));
	}
}