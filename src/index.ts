import {Customary} from "#customary/Customary.js";
import type {CustomaryDeclaration as C} from "#customary/CustomaryDeclaration";
import {CustomaryElement} from "#customary/CustomaryElement.js";

// https://github.com/parcel-bundler/parcel/issues/4796#issuecomment-660356062
// noinspection JSUnusedGlobalSymbols
export type CustomaryDeclaration<T extends HTMLElement> = C<T>;

export {Customary, CustomaryElement};

bootstrap();

function bootstrap() {
    document.addEventListener("DOMContentLoaded", Customary__DOMContentLoaded);
}

function Customary__DOMContentLoaded() {
    if ((globalThis as any)[`customary-options:autodetect-dont`]) return;
    void Customary.autodetect();
}
