import {FetchText} from "#customary/fetch/FetchText.js";

interface CSSStyleSheetImporter {
    getCSSStyleSheet(location: string): Promise<CSSStyleSheet | undefined>;
}

export class ExternalLoader {
    constructor(
        private readonly fetchText: FetchText,
        private readonly cssStyleSheetImporter: CSSStyleSheetImporter,
        private readonly options: {
            name: string,
            import_meta: ImportMeta;
        }
    ) {}

    async loadHtml(): Promise<string>
    {
        const location = this.resolveResourceLocation('html');
        return await this.fetchText.fetchText(location);
    }

    async loadCssStyleSheet(): Promise<undefined | CSSStyleSheet>
    {
        const location = this.resolveResourceLocation('css');
        return await this.cssStyleSheetImporter.getCSSStyleSheet(location);
    }

    private resolveResourceLocation(extension: string): string
    {
        return this.options.import_meta.resolve(`./${this.options.name}.${extension}`);
    }

}
