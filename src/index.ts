import {Customary} from "#customary/Customary.js";
import type {CustomaryOptions as C} from "#customary/CustomaryOptions.js";
import {CustomaryHTMLElement} from "#customary/html/CustomaryHTMLElement.js";
import {CustomaryLitElement} from "#customary/lit/CustomaryLitElement.js";

// https://github.com/parcel-bundler/parcel/issues/4796#issuecomment-660356062
// noinspection JSUnusedGlobalSymbols
export type CustomaryOptions<T extends HTMLElement> = C<any>;

export {Customary, CustomaryHTMLElement, CustomaryLitElement};
