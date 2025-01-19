import {CustomaryHooks} from "#customary/CustomaryHooks.js";
import {CustomaryConfig} from "#customary/CustomaryConfig.js";

export type CustomaryDeclaration<T extends HTMLElement> = {
    name?: string;
    config?: CustomaryConfig;
    hooks?: CustomaryHooks<T>;
    values?: Record<string, any>;
};
