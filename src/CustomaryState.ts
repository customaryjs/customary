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

		const {KnockoutBridge: ko} = await import("customary/knockoutjs/KnockoutBridge.js");
		this._ko = ko;

		const bindingContext = ko.merge(this._bindingContext, state);
		if (!this._bindingContext) {
			ko.applyBindings(bindingContext, this.parentNode);
		}
		this._bindingContext = bindingContext;
	}

	getState(): State {
		if (this._bindingContext === null || this._bindingContext === undefined) return undefined;
		return this._ko.snapshot(this._bindingContext);
	}

	private _bindingContext: any;
	private _ko: any;
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
