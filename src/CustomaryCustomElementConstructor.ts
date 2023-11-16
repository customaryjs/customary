import {CustomaryOptions} from "customary/CustomaryOptions.js";

export interface CustomaryCustomElementConstructor<T extends HTMLElement> extends CustomElementConstructor {
    customary: CustomaryOptions<T>;
}
