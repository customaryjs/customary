import {CustomaryHooks} from "#customary/CustomaryHooks.js";
import {CustomaryConfig} from "#customary/CustomaryConfig.js";

export type CustomaryOptions<T extends HTMLElement> = {
    config: {name: string} & CustomaryConfig;
    hooks?: CustomaryHooks<T>;
    state?: Record<string, object | object[]>;
};
