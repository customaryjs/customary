// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomaryDefinition} from "customary/CustomaryDefinition.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CSSStyleSheetImporter} from "customary/cssstylesheet/CSSStyleSheetImporter.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomaryRegistry} from "customary/CustomaryRegistry.js";
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
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomaryCustomElementConstructor} from "customary/CustomaryCustomElementConstructor.js";

export class CustomaryDefine<T extends HTMLElement> {

    async define(): Promise<CustomElementConstructor> {
        this.adopt_font_cssStyleSheets();

        const resourceLocationResolver = this.getResourceLocationResolver();

        const tilesetHtml = await this.getTilesetHtml(resourceLocationResolver);
        const cssStyleSheet = await this.getCssStyleSheet(resourceLocationResolver);

        const tile: string = this.options.defineOptions?.detileDont ?
            tilesetHtml : this.detile(tilesetHtml, '<!--customary-->');
        const documentFragment = this.toDocumentFragment(tile);

        const customaryDefinition: CustomaryDefinition = {
            documentFragment,
            cssStyleSheet,
            constructOptions: this.options.constructOptions,
            slotOptions: this.options.slotOptions,
            attributeOptions: this.options.attributeOptions,
        };
        this.customaryRegistry.set(this.customElementConstructor, customaryDefinition);
        const {name, defineOptions} = this.options;
        customElements.define(name, this.customElementConstructor, defineOptions?.elementDefinitionOptions ?? {extends: 'div'});
        return await customElements.whenDefined(name);
    }

    private adopt_font_cssStyleSheets() {
        const fontLocations = this.options.defineOptions?.fontLocations;
        if (!fontLocations) return;
        this.cssStyleSheetAdopter.adoptCSSStylesheets(fontLocations).then(/*fire and forget*/);
    }

    private getResourceLocationResolver() {
        const resourceLocationResolution = this.options.defineOptions?.resourceLocationResolution;
        switch (resourceLocationResolution?.kind) {
            case "relative": return new RelativeResourceLocationResolver(resourceLocationResolution.pathPrefix);
            case "flat":
            default: return new FlatResourceLocationResolver();
        }
    }

    private toDocumentFragment(innerHtml: string): DocumentFragment {
        const templateElement: HTMLTemplateElement = document.createElement('template');
        templateElement.innerHTML = innerHtml;
        return templateElement.content;
    }

    private async getTilesetHtml(resourceLocationResolver: ResourceLocationResolver): Promise<string> {
        const location = await this.resolveResourceLocation('html', resourceLocationResolver);
        return await this.fetchText.fetchText(location);
    }

    private detile(text: string, delimiter: string): string
    {
        const strings = text.split(delimiter);
        if (strings.length < 3) throw new Error('Need two delimiters');
        const string = strings[1];
        const split = string?.split(delimiter);
        const string1 = split?.[0];
        return string1 ?? text;
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
        private readonly customaryRegistry: CustomaryRegistry,
        private readonly customElementConstructor: CustomaryCustomElementConstructor<any>,
    ) {
        const fetchText: FetchText = FetchText_DOM_singleton;
        const cssStyleSheetImporter = new CSSStyleSheetImporter(fetchText);
        this.cssStyleSheetImporter = cssStyleSheetImporter;
        this.cssStyleSheetAdopter = new CSSStyleSheetAdopter(cssStyleSheetImporter);
        this.fetchText = fetchText;
        this.options = this.getCustomaryOptions(customElementConstructor);
    }

    private getCustomaryOptions(customElementConstructor: CustomaryCustomElementConstructor<any>) {
        const customaryOptions = customElementConstructor.customary;
        if (!customaryOptions) {
            throw new Error(
                'Customary needs options. ' +
                'Declare them in your custom element class as a "customary" static attribute.')
        }
        if (customaryOptions.preset === "recommended") {
            customaryOptions.defineOptions ??= {};
            customaryOptions.defineOptions.resourceLocationResolution ??= {
                kind: "relative",
                pathPrefix: '../',
            };
        }
        return customaryOptions;
    }

    private readonly options: CustomaryOptions<T>
    private readonly fetchText: FetchText;
    private readonly cssStyleSheetAdopter: CSSStyleSheetAdopter;
    private readonly cssStyleSheetImporter: CSSStyleSheetImporter;

}