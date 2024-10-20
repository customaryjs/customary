import {CustomaryHooks} from "customary/CustomaryHooks.js";

export type CustomaryOptions<T extends HTMLElement> = {
    config: {name: string} & CustomaryConfig;
    hooks?: CustomaryHooks<T>;
    state?: object | object[];
};

export type CustomaryConfig = {
    construct?: {
        adoptStylesheetDont?: boolean;
        attachShadowDont?: boolean;
        replaceChildrenDont?: boolean;
    };
    define?: {
        extends?: string;
        detileDont?: boolean;
        fontLocation?: string;
        fontLocations?: string[];
        resourceLocationResolution?: {
            kind: 'flat';
        } | {
            kind: 'relative';
            pathPrefix: string;
        };
    };
    preset?: CustomaryPreset;
}

export type CustomaryPreset = 'recommended';
