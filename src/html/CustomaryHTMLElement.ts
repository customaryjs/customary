import {CustomaryState} from "#customary/CustomaryState.js";
import {CustomaryHTML} from "#customary/html/CustomaryHTML.js";

export class CustomaryHTMLElement extends HTMLElement {

    constructor() {
        super();
        CustomaryHTML.construct(this);
    }

    // noinspection JSUnusedGlobalSymbols
    static get observedAttributes() {
        return CustomaryHTML.observedAttributes(this);
    }

    // noinspection JSUnusedGlobalSymbols
    connectedCallback() {
        CustomaryHTML.connectedCallback(this);
    }

    // noinspection JSUnusedGlobalSymbols
    disconnectedCallback() {
        CustomaryHTML.disconnectedCallback(this);
    }

    // noinspection JSUnusedGlobalSymbols
    adoptedCallback() {
        CustomaryHTML.adoptedCallback(this);
    }

    // noinspection JSUnusedGlobalSymbols
    attributeChangedCallback(property: string, oldValue: string, newValue: string) {
        CustomaryHTML.attributeChangedCallback(this, property, oldValue, newValue);
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