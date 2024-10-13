import {CustomaryOptions} from "customary/CustomaryOptions.js";

export interface CustomaryCustomElementConstructor extends CustomElementConstructor {
    customary: CustomaryOptions;
}
