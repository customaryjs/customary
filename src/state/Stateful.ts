export class Stateful {

    async setState(state: object | object[] | undefined): Promise<void> {
        this._state = state === undefined ? undefined : await this.observe(state);
    }

    getStateRawShouldIt(): any {
        return this._state;
    }

    private async observe(state: object | object[]) {
        const {KnockoutBridge: ko} = await import("customary/knockoutjs/KnockoutBridge.js");

        if (state instanceof Array) {
            return ko.observableArray(state);
        }

        return ko.putAllAsObservables(this._state ?? {}, state);
    }

    private _state: object | undefined;

    async setStateAndBind(parent: ParentNode, state: object | object[] | undefined) {
        await this.setState(state);

        if (state === undefined) return;

        const {KnockoutBridge: ko} = await import("customary/knockoutjs/KnockoutBridge.js");

        ko.applyBindings(this._state, parent);
    }
}
