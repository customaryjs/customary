// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomaryConstructOptions} from "customary/CustomaryConstructOptions.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomarySlotOptions} from "customary/CustomarySlotOptions.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomaryAttributeOptions} from "customary/CustomaryAttributeOptions.js";

export type CustomaryDefinition = {
    documentFragment: DocumentFragment;
    cssStyleSheet: CSSStyleSheet | undefined;
    constructOptions: CustomaryConstructOptions<any> | undefined;
    slotOptions: CustomarySlotOptions<any> | undefined;
    attributeOptions: CustomaryAttributeOptions<any> | undefined;
    state: object | object[] | undefined;
}
