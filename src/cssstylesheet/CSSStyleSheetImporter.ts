// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {FetchText, FetchText_DOM_singleton} from "customary/fetch/FetchText.js";

export class CSSStyleSheetImporter {

    constructor(private readonly fetchText: FetchText = FetchText_DOM_singleton) {
        this.importFn = getImportFn();
    }

    async getCSSStyleSheet(location: string): Promise<CSSStyleSheet | undefined> {
            if (this.importFn) {
                return await this.importCSSStyleSheet(location, this.importFn);
            }
            return await this.fetchCSSStyleSheet(location);
    }

    private async importCSSStyleSheet(location: string, importFn: ImportFn) {
        console.log('import: ' + location);
        try {
            const cssModule: any = await importFn(location);
            return cssModule.default;
        }
        catch (error) {
            console.error(error);
            return undefined;
        }
    }

    private async fetchCSSStyleSheet(location: string) {
        const text: string = await this.fetchText.fetchText(location);
        const cssStyleSheet = new CSSStyleSheet({baseURL: location});
        return cssStyleSheet.replace(text);
    }

    private readonly importFn: ImportFn | undefined;
}

type ImportFn = (location: string) => Promise<CSSStyleSheet>;

/**
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import/with
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#loading_non-javascript_resources
 */
function getImportFn(): ImportFn | undefined {
    try {
        return eval('location => import(location, {with: {type: "css"}})');
    }
    catch (error) {
        if (error instanceof SyntaxError) {
            return undefined;
        }
        throw error;
    }
}
