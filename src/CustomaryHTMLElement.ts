import {Customary} from "customary/Customary.js";
import {Stateful} from "customary/state/Stateful.js";

export class CustomaryHTMLElement extends HTMLElement {

    constructor() {
        super();
        Customary.construct(this);
    }

    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    static get observedAttributes() {
        return Customary.observedAttributes(this);
    }

    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    attributeChangedCallback(property: string, oldValue: string, newValue: string) {
        Customary.attributeChangedCallback(this, property, oldValue, newValue);
    }

    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    get state(): any {
        return this.stateful.getStateRawShouldIt();
    }

    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    setState(state: any): void;
    setState(fn: (state: any) => any): void;
    setState(state_or_fn: any | ((state: any) => any)): void
    {
        void this.stateful.setState(state_or_fn);
    }

    get stateful(): Stateful {
        return this._stateful ??= new Stateful();
    }

    private _stateful: Stateful | undefined;

}