import {Customary} from "customary/Customary.js";

export class CustomaryHTMLElement extends HTMLElement {

    constructor() {
        super();
        Customary.construct(this);
    }

    static get observedAttributes() {
        return Customary.observedAttributes(this);
    }

    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    attributeChangedCallback(property: string, oldValue: string, newValue: string) {
        Customary.attributeChangedCallback(this, property, oldValue, newValue);
    }

}