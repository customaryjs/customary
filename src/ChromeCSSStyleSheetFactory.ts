// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CSSStyleSheetFactory} from "customary/CSSStyleSheetFactory.js";

export class ChromeCSSStyleSheetFactory implements CSSStyleSheetFactory {
    public static createChromeCSSStyleSheetFactory(): ChromeCSSStyleSheetFactory | undefined {
        try {
            return new ChromeCSSStyleSheetFactory();
        }
        catch (error) {
            if (!(error instanceof SyntaxError)) {
                throw error;
            }
            return undefined;
        }
    }

    private readonly importFn: (location: string) => Promise<CSSStyleSheet>;

    constructor() {
        this.importFn = eval('location => import(location, {assert: {type: "css"}})');
    }

    async getCSSStyleSheet(location: string): Promise<CSSStyleSheet> {
        console.log('import: ' + location);
        const cssModule: any = await this.importFn(location);
        return cssModule.default;
    }
}