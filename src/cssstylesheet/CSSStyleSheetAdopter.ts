// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CSSStyleSheetImporter} from "customary/cssstylesheet/CSSStyleSheetImporter.js";

export class CSSStyleSheetAdopter {
    constructor(
        private readonly cssStyleSheetImporter: CSSStyleSheetImporter
    ) {}

    public async adoptCSSStylesheets(...locations: string[]) {
        const cssStyleSheets = await this.getCSSStyleSheets(locations);
        this.adoptedStyleSheets_push(cssStyleSheets);
    }
    private async getCSSStyleSheets(locations: string[]): Promise<CSSStyleSheet[]> {
        return (await Promise.all(
            locations
                .map(location => this.getCSSStyleSheet(location))
                .filter(cssStyleSheet => !!cssStyleSheet)
        )) as CSSStyleSheet[];
    }

    private async getCSSStyleSheet(location: string): Promise<CSSStyleSheet | undefined> {
        return await this.cssStyleSheetImporter.getCSSStyleSheet(location);
    }

    /**
     * adopter of font stylesheets can only be the root document dom, not the shadow dom.
     * @see https://github.com/microsoft/vscode/issues/159877#issuecomment-1262843952
     * @see https://github.com/mdn/interactive-examples/issues/887#issuecomment-432606925
     */
    private adoptedStyleSheets_push(cssStyleSheets?: CSSStyleSheet[]) {
        if (!cssStyleSheets) return;
        document.adoptedStyleSheets.push(...cssStyleSheets);
    }

}