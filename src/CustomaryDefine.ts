// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomaryDefinition} from "customary/CustomaryDefinition.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CSSStyleSheetImporter} from "customary/cssstylesheet/CSSStyleSheetImporter.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {DocumentFragmentImporter} from "customary/documentfragment/DocumentFragmentImporter.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {ResourceLocationResolver} from "customary/location/ResourceLocationResolver.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {RelativeResourceLocationResolver} from "customary/location/RelativeResourceLocationResolver.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {FlatResourceLocationResolver} from "customary/location/FlatResourceLocationResolver.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CSSStyleSheetAdopter} from "customary/cssstylesheet/CSSStyleSheetAdopter.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {FetchText, FetchText_DOM_singleton} from "customary/fetch/FetchText.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomaryOptions} from "customary/CustomaryOptions.js";

export class CustomaryDefine<T extends HTMLElement> {

    async define(): Promise<CustomaryDefinition> {
        this.adopt_font_cssStyleSheets();
        const resources: [DocumentFragment, (CSSStyleSheet | undefined)] = await this.importResources();
        return {
            documentFragment: resources[0],
            cssStylesheet: resources[1],
            constructOptions: this.options.constructOptions,
            slotOptions: this.options.slotOptions,
            attributeOptions: this.options.attributeOptions,
        };
    }

    private adopt_font_cssStyleSheets() {
        const fontLocations = this.options.defineOptions?.fontLocations;
        if (!fontLocations) return;
        this.cssStyleSheetAdopter.adoptCSSStylesheets(fontLocations).then(/*fire and forget*/);
    }

    private async importResources(): Promise<[DocumentFragment, (CSSStyleSheet | undefined)]> {
        const resourceLocationResolver = this.getResourceLocationResolver();
        return await Promise.all([
            await this.getDocumentFragment(resourceLocationResolver),
            await this.getCssStyleSheet(resourceLocationResolver)
        ]);
    }

    private getResourceLocationResolver() {
        const resourceLocationResolution = this.options.defineOptions?.resourceLocationResolution;
        switch (resourceLocationResolution?.kind) {
            case "relative": return new RelativeResourceLocationResolver(resourceLocationResolution.pathPrefix);
            case "flat":
            default: return new FlatResourceLocationResolver();
        }
    }

    private async getDocumentFragment(resourceLocationResolver: ResourceLocationResolver) {
        const location = await this.resolveResourceLocation('html', resourceLocationResolver);
        return await this.documentFragmentImporter.getDocumentFragment(location);
    }

    private async getCssStyleSheet(resourceLocationResolver: ResourceLocationResolver) {
        const location = await this.resolveResourceLocation('css', resourceLocationResolver);
        return await this.cssStyleSheetImporter.getCSSStyleSheet(location);
    }

    private async resolveResourceLocation(
        extension: string, resourceLocationResolver: ResourceLocationResolver
    ): Promise<string> {
        const specified = await resourceLocationResolver.resolveResourceLocation(`${this.options.name}.${extension}`);
        return await this.options.import_meta.resolve!(specified);
    }

    constructor(
        private readonly options: CustomaryOptions<T>
    ) {
        const fetchText: FetchText = FetchText_DOM_singleton;
        const cssStyleSheetImporter = new CSSStyleSheetImporter(fetchText);
        this.cssStyleSheetImporter = cssStyleSheetImporter;
        this.cssStyleSheetAdopter = new CSSStyleSheetAdopter(cssStyleSheetImporter);
        this.documentFragmentImporter = new DocumentFragmentImporter(fetchText);
    }

    private readonly documentFragmentImporter: DocumentFragmentImporter;
    private readonly cssStyleSheetAdopter: CSSStyleSheetAdopter;
    private readonly cssStyleSheetImporter: CSSStyleSheetImporter;

}