import {FetchText, FetchText_DOM_singleton} from "#customary/fetch/FetchText.js";

export class CSSStyleSheetImporter {

    constructor(private readonly fetchText: FetchText = FetchText_DOM_singleton) {}

    async getCSSStyleSheet(location: string): Promise<CSSStyleSheet | undefined> {
        return await this.fetchCSSStyleSheet(location);
    }

    private async fetchCSSStyleSheet(location: string) {
        const text: string = await this.fetchText.fetchText(location);
        const cssStyleSheet = new CSSStyleSheet({baseURL: location});
        return cssStyleSheet.replace(text);
    }
}
