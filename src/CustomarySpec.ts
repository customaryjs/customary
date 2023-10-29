// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomaryDefineOptions} from "customary/CustomaryDefineOptions.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomaryConstructOptions} from "customary/CustomaryConstructOptions.js";

export type CustomarySpec = {
    name: string;
    import_meta: ImportMeta;
    defineOptions?: CustomaryDefineOptions;
    constructOptions?: CustomaryConstructOptions;
}
