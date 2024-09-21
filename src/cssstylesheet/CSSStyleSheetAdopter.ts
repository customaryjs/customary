interface CSSStyleSheetImporter {
    getCSSStyleSheet(location: string): Promise<CSSStyleSheet | undefined>
}

export class CSSStyleSheetAdopter {
    constructor(
        private readonly cssStyleSheetImporter: CSSStyleSheetImporter,
        private readonly document: Document,
    ) {}

    public async adoptCSSStylesheets(...locations: string[]) {
        const cssStyleSheetsMaybe: (CSSStyleSheet | undefined)[] = await Promise.all(
            locations.map(location => this.cssStyleSheetImporter.getCSSStyleSheet(location))
        );
        const cssStyleSheets: CSSStyleSheet[] = cssStyleSheetsMaybe.filter(
            cssStyleSheet => !!cssStyleSheet
        );
        if (cssStyleSheets.length > 0) {
            this.adoptedStyleSheets_push(cssStyleSheets);
        }
    }

    /**
     * adopter of font stylesheets can only be the root document dom, not the shadow dom.
     * @see https://github.com/microsoft/vscode/issues/159877#issuecomment-1262843952
     * @see https://github.com/mdn/interactive-examples/issues/887#issuecomment-432606925
     */
    private adoptedStyleSheets_push(cssStyleSheets: CSSStyleSheet[]) {
        this.document.adoptedStyleSheets.push(...cssStyleSheets);
    }

}