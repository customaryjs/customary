export class Stateful {

    async setState(state: State): Promise<void>;
    async setState(fn: StateFn): Promise<void>;
    async setState(state_or_fn: State | StateFn): Promise<void> {
        const state =
            state_or_fn instanceof Function
                ? state_or_fn(await this.snapshot(this._bindingContext))
                : state_or_fn;
        this._bindingContext = await this.merge(this._bindingContext, state);
    }

    private async snapshot(bindingContext: any): Promise<State> {
        if (bindingContext === null || bindingContext === undefined) return bindingContext;
        const {KnockoutBridge: ko} = await import("customary/knockoutjs/KnockoutBridge.js");
        return ko.snapshot(bindingContext);
    }

    private async merge(bindingContext: any, state: State): Promise<any> {
        if (state === null || state === undefined) return bindingContext;
        const {KnockoutBridge: ko} = await import("customary/knockoutjs/KnockoutBridge.js");
        return ko.merge(bindingContext, state);
    }

    getStateRawShouldIt(): any {
        return this._bindingContext;
    }

    private _bindingContext: any;

    async setStateAndBind(parent: ParentNode, state: object | object[] | undefined) {
        await this.setState(state);

        if (state === undefined) return;

        const {KnockoutBridge: ko} = await import("customary/knockoutjs/KnockoutBridge.js");

        ko.applyBindings(this._bindingContext, parent);
    }
}

type State = any;
type StateFn = (state: State) => State;
