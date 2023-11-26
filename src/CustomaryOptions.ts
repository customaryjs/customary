// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomaryDefineOptions} from "customary/CustomaryDefineOptions.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomaryConstructOptions} from "customary/CustomaryConstructOptions.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomaryAttributeOptions} from "customary/CustomaryAttributeOptions.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomarySlotOptions} from "customary/CustomarySlotOptions.js";

export type CustomaryPreset = 'recommended';

export type CustomaryOptions<T extends HTMLElement> = {
    name: string;
    import_meta: ImportMeta;
    preset?: CustomaryPreset;
    tileset?: string;
    defineOptions?: CustomaryDefineOptions;
    constructOptions?: CustomaryConstructOptions<T>;
    attributeOptions?: CustomaryAttributeOptions<T>;
    slotOptions?: CustomarySlotOptions<T>;
}
