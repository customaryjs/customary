// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CSSStyleSheetFactory} from "customary/CSSStyleSheetFactory.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {ChromeCSSStyleSheetFactory} from "customary/ChromeCSSStyleSheetFactory.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {FirefoxCSSStyleSheetFactory} from "customary/FirefoxCSSStyleSheetFactory.js";

export class CSSStyleSheetImporter {

    private static readonly cssStyleSheetFactory: CSSStyleSheetFactory =
        ChromeCSSStyleSheetFactory.createChromeCSSStyleSheetFactory() ??
        new FirefoxCSSStyleSheetFactory();

    constructor(
        private readonly location: string
    ) {
    }

    async getCSSStyleSheet(): Promise<CSSStyleSheet | undefined> {
        try {
            return await CSSStyleSheetImporter.cssStyleSheetFactory.getCSSStyleSheet(this.location);
        }
        catch (error) {
            console.log(error);
            return undefined;
        }
    }

}