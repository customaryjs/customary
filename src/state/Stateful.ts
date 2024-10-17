export class Stateful {

    async setState(state: State): Promise<void>
    async setState(fn: StateFn): Promise<void>
    async setState(state_or_fn: State | StateFn): Promise<void> {
        const state =
            state_or_fn instanceof Function
                ? state_or_fn(this.getState())
                : state_or_fn;
        await this.merge(state);
    }

    getState(): State {
        if (this._bindingContext === null || this._bindingContext === undefined) return undefined;
        return this._ko.snapshot(this._bindingContext);
    }

    private async merge(state: State): Promise<any> {
        if (state === null || state === undefined) return undefined;
        const {KnockoutBridge: ko} = await import("customary/knockoutjs/KnockoutBridge.js");
        this._ko = ko;
        this._bindingContext = ko.merge(this._bindingContext, state);
    }

    private _bindingContext: any;
    private _ko: any;

    async setStateAndBind(parent: ParentNode, state: object | object[] | undefined) {
        await this.setState(state);

        if (state === undefined) return;

        const {KnockoutBridge: ko} = await import("customary/knockoutjs/KnockoutBridge.js");
        this._ko = ko;
        ko.applyBindings(this._bindingContext, parent);
    }
}

type State = any;
type StateFn = (state: State) => State;
