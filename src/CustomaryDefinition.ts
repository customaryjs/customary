// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomaryConstructOptions} from "customary/CustomaryConstructOptions.js";

export interface CustomaryDefinition {
    constructOptions?: CustomaryConstructOptions;
    cssStylesheet?: CSSStyleSheet;
    documentFragment: DocumentFragment;
}
