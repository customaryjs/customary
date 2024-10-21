import {CustomaryHooks} from "customary/CustomaryHooks.js";
import {CustomaryConfig} from "customary/CustomaryConfig";

export type CustomaryOptions<T extends HTMLElement> = {
    config: {name: string} & CustomaryConfig;
    hooks?: CustomaryHooks<T>;
    state?: any;
};
