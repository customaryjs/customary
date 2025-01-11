import {CustomaryHooks} from "#customary/CustomaryHooks.js";
import {CustomaryConfig} from "#customary/CustomaryConfig.js";

export type CustomaryOptions<T extends HTMLElement> = {
    name?: string;
    config?: CustomaryConfig;
    hooks?: CustomaryHooks<T>;
    state?: Record<string, object | object[]>;
};

export type CustomaryDeclaration<T extends HTMLElement> = CustomaryOptions<T>;
