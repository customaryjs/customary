// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CSSStyleSheetFactory} from "customary/CSSStyleSheetFactory.js";

export class FirefoxCSSStyleSheetFactory implements CSSStyleSheetFactory {
    async getCSSStyleSheet(location: string): Promise<CSSStyleSheet> {
        console.log('fetch: ' + location);
        const response: Response = await fetch(location);
        const text: string = await response.text();
        const cssStyleSheet = new CSSStyleSheet({baseURL: location});
        return cssStyleSheet.replace(text);
    }

}