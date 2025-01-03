import {Customary} from "#customary/Customary.js";
import type {CustomaryOptions as C} from "#customary/CustomaryOptions.js";
import {CustomaryElement} from "#customary/CustomaryElement.js";

// https://github.com/parcel-bundler/parcel/issues/4796#issuecomment-660356062
// noinspection JSUnusedGlobalSymbols
export type CustomaryDeclaration<T extends HTMLElement> = C<any>;
export type CustomaryOptions<T extends HTMLElement> = C<any>;

export * from "#customary/lit";
export {Customary, CustomaryElement};
