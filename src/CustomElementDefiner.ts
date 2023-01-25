// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomElementAssemblyInstruction} from "./CustomElementAssemblyInstruction.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CSSStyleSheetImporter} from "./CSSStyleSheetImporter.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {DocumentFragmentImporter} from "./DocumentFragmentImporter.js";

export class CustomElementDefiner {
    async define(
        name: string,
        constructor: CustomElementConstructor,
        import_meta: ImportMeta,
        options: {
            fontLocations?: string[],
        } = {}
    ): Promise<CustomElementAssemblyInstruction> {
        this.fontsAdoptCSSStyleSheets(options.fontLocations).then(/*fire and forget*/);
        const results: [DocumentFragment, CSSStyleSheet | undefined] =
            await Promise.all([
                this.getDocumentFragment(
                    await this.resolveResourceLocation(import_meta, name, 'html')
                ),
                this.getCSSStyleSheet(
                    await this.resolveResourceLocation(import_meta, name, 'css')
                )
            ]);
        return {
            documentFragment: results[0],
            cssStylesheet: results[1],
        };
    }

    private async resolveResourceLocation(
        import_meta: ImportMeta, name: string, extension: string
    ): Promise<string> {
        return await import_meta.resolve!(`../${name}.${extension}`);
    }

    private async getDocumentFragment(location: string): Promise<DocumentFragment> {
        return await new DocumentFragmentImporter(location).getDocumentFragment();
    }    

    private async getCSSStyleSheet(location: string): Promise<CSSStyleSheet | undefined> {
        return await new CSSStyleSheetImporter(location).getCSSStyleSheet();
    }

    private async fontsAdoptCSSStyleSheets(locations?: string[]) {
        if (!locations) return;
        const cssStylesheetFonts: CSSStyleSheet[] = await this.getCSSStyleSheets(locations);
        this.adoptStylesheetFonts(cssStylesheetFonts);
    }

    private async getCSSStyleSheets(locations: string[]): Promise<CSSStyleSheet[]> {
        return (await Promise.all(
            locations
                .map(location => this.getCSSStyleSheet(location))
                .filter(cssStyleSheet => !!cssStyleSheet)
        )) as CSSStyleSheet[];
    }

    /**
     * adopter of font stylesheets can only be the root document dom, not the shadow dom.
     * @see https://github.com/microsoft/vscode/issues/159877#issuecomment-1262843952
     * @see https://github.com/mdn/interactive-examples/issues/887#issuecomment-432606925
     */
    private adoptStylesheetFonts(cssStylesheetFonts?: CSSStyleSheet[]) {
        if (!cssStylesheetFonts) return;
        document.adoptedStyleSheets.push(...cssStylesheetFonts);
    }
}