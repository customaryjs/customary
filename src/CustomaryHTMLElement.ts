import {Customary} from "customary/Customary.js";
import {CustomaryState} from "customary/CustomaryState.js";

export class CustomaryHTMLElement extends HTMLElement {

    constructor() {
        super();
        Customary.construct(this);
    }

    // noinspection JSUnusedGlobalSymbols
    static get observedAttributes() {
        return Customary.observedAttributes(this);
    }

    // noinspection JSUnusedGlobalSymbols
    connectedCallback() {
        Customary.connectedCallback(this);
    }

    // noinspection JSUnusedGlobalSymbols
    disconnectedCallback() {
        Customary.disconnectedCallback(this);
    }

    // noinspection JSUnusedGlobalSymbols
    adoptedCallback() {
        Customary.adoptedCallback(this);
    }

    // noinspection JSUnusedGlobalSymbols
    attributeChangedCallback(property: string, oldValue: string, newValue: string) {
        Customary.attributeChangedCallback(this, property, oldValue, newValue);
    }

    // noinspection JSUnusedGlobalSymbols
    get state(): any {
        return this.customaryState.getState();
    }

    // noinspection JSUnusedGlobalSymbols
    setState(state: any): void;
    // noinspection JSUnusedGlobalSymbols
    setState(fn: (state: any) => any): void;
    setState(state_or_fn: any | ((state: any) => any)): void
    {
        void this.customaryState.setState(state_or_fn);
    }

    private get customaryState(): CustomaryState {
        return this._customaryState ??= new CustomaryState(this);
    }

    private _customaryState: CustomaryState | undefined;

}