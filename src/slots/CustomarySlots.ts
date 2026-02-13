import {CustomaryHooks} from "#customary/CustomaryHooks";

export class CustomarySlots {
	constructor(
		element: HTMLElement,
		hooks: CustomaryHooks<any> | undefined
	) {
		this.element = element;
		this.hooks = hooks;
	}
	private readonly element: HTMLElement;
	private readonly hooks: CustomaryHooks<any> | undefined;

	install_slotchange() {
		const slotchange =
			this.hooks?.slots?.slotchange;
		if (!slotchange) return;

		// on the first render, execute once for the first time without an event
		slotchange(this.element);

		/*
        https://stackoverflow.com/questions/67332635/slots-does-not-work-on-a-html-web-component-without-shadow-dom
        */
		this.element.shadowRoot!.addEventListener(
			'slotchange', event => slotchange(this.element, event)
		);
	}
}