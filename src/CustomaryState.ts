import {KnockoutBridge, KnockoutBridgeFactory} from "#customary/knockoutjs/KnockoutBridge.js";

export class CustomaryState {
	constructor (private readonly parentNode: ParentNode) {}

	async setState(state: State): Promise<void>
	// noinspection JSUnusedGlobalSymbols
	async setState(fn: StateFn): Promise<void>
	async setState(state_or_fn: State | StateFn): Promise<void> {
		const state =
				state_or_fn instanceof Function
						? state_or_fn(this.getState())
						: state_or_fn;

		if (state === null || state === undefined) return undefined;

		const ko: KnockoutBridge = this._ko ??
				(this._ko = await new KnockoutBridgeFactory().createKnockoutBridge());

		const oldBindingContext = this._bindingContext;
		const newBindingContext = ko.merge(oldBindingContext, state);
		if (!oldBindingContext) {
			ko.applyBindings(newBindingContext, this.parentNode);
		}
		this._bindingContext = newBindingContext;
	}

	getState(): State {
		if (this._bindingContext === null || this._bindingContext === undefined) return undefined;
		return this._ko?.snapshot(this._bindingContext);
	}

	private _bindingContext: any;
	private _ko: KnockoutBridge | undefined = undefined;
}

type State = any;
type StateFn = (state: State) => State;

export function hydrateStateBindings(node: Node) {
	switch (node.nodeType) {
		case Node.DOCUMENT_FRAGMENT_NODE:
		{
			node.childNodes.forEach(node => {
				hydrateStateBindings(node);
			});
			break;
		}
		case Node.ELEMENT_NODE:
		{
			if (node instanceof Element) {
				const htmlString_old = node.innerHTML;
				const htmlString_new = replaceStateBindings(htmlString_old);
				if (htmlString_new !== htmlString_old)
					node.innerHTML = htmlString_new;
			}
			break;
		}
	}
}

function replaceStateBindings(htmlString: string) {
	return htmlString.replace(/\{this\.state\.(\w+)}/g, '<span data-bind="text: $1"></span>');
}
