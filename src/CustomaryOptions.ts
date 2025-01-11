import {CustomaryHooks} from "#customary/CustomaryHooks.js";
import {CustomaryConfig} from "#customary/CustomaryConfig.js";

export type CustomaryOptions<T extends HTMLElement> = {
    name?: string;
    config?: CustomaryConfig;
    hooks?: CustomaryHooks<T>;
    values?: Record<string, any>;
};

export type CustomaryDeclaration<T extends HTMLElement> = CustomaryOptions<T>;
