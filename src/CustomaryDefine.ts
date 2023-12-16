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
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {NotFound404Error} from "customary/fetch/NotFound404Error.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomaryHTMLElement} from "customary/CustomaryHTMLElement.js";

export class CustomaryDefine<T extends HTMLElement> {

    async define(): Promise<CustomElementConstructor> {
        this.adopt_font_cssStyleSheets();

        const resourceLocationResolver = this.getResourceLocationResolver();
        const documentFragment = await this.getDocumentFragment(resourceLocationResolver);
        const cssStyleSheet = await this.getCssStyleSheet(resourceLocationResolver);

        const customaryDefinition: CustomaryDefinition = {
            documentFragment,
            cssStyleSheet,
            constructOptions: this.options.constructOptions,
            slotOptions: this.options.slotOptions,
            attributeOptions: this.options.attributeOptions,
        };
        this.customaryRegistry.set(this.customElementConstructor, customaryDefinition);
        const {name} = this.options;
        customElements.define(name, this.customElementConstructor, this.getElementDefinitionOptions());
        return await customElements.whenDefined(name);
    }

    private getElementDefinitionOptions(): ElementDefinitionOptions | undefined {
        const {defineOptions} = this.options;
        const superclass = Object.getPrototypeOf(this.customElementConstructor);
        if (!defineOptions?.extends) {
            const superclasses = [HTMLElement, CustomaryHTMLElement];
            if (!superclasses.includes(superclass)) {
                const supername = superclass.name;
                const supernames = superclasses.map(superclass => superclass.name);
                throw new Error(
                    `Your custom element is autonomous, but` +
                    ` your custom element class extends superclass ${supername}, which is a mismatch. You ` +
                    `need to extend one of: ${supernames.join(", ")}`);
            }
            return undefined;
        }
        const supername = superclass.name;
        if (!supername.toLowerCase().includes(defineOptions?.extends)) {
            throw new Error(
                `Your custom element definition declares 'extends' as "${defineOptions?.extends}", but` +
                ` your custom element class extends superclass ${supername}, which is a mismatch. You ` +
                `need to use a matching 'extends' declaration.`);
        }
        return {extends: defineOptions?.extends};
    }

    private adopt_font_cssStyleSheets() {
        const locations: string[] = [];
        const fontLocation = this.options.defineOptions?.fontLocation;
        if (fontLocation) locations.push(fontLocation);
        const fontLocations = this.options.defineOptions?.fontLocations;
        if (fontLocations) locations.push(...fontLocations);
        if (locations.length === 0) return;
        this.cssStyleSheetAdopter.adoptCSSStylesheets(...locations).then(/*fire and forget*/);
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
        const tileset = await this.getTileset(resourceLocationResolver);
        const tile = await this.getTile(tileset);
        return this.toDocumentFragment(tile);
    }

    private async getTileset(resourceLocationResolver: ResourceLocationResolver) {
        if (this.options.getTileset) {
            return await this.options.getTileset();
        }
        const location = await this.resolveResourceLocation('html', resourceLocationResolver);
        try {
            return await this.fetchText.fetchText(location);
        }
        catch (error) {
            if (error instanceof NotFound404Error) {
                // TODO re-wrap as an instructive error
                throw error;
            }
            else
                throw error;
        }
    }

    private async getTile(tileset: string) {
        if (this.options.defineOptions?.detileDont) {
            return tileset;
        }
        const delimiters = ['customary', this.options.name].map(s => `<!--${s}-->`);
        for (const delimiter of delimiters) {
            const tile: string | undefined = this.detile(tileset, delimiter);
            if (tile) {
                await this.options.defineOptions?.onTile?.(tile);
                return tile;
            }
        }
        throw new Error(
            'Delimited tile not found.' +
            ' Customary looks for delimiters in your html tileset' +
            ' to read the tile your custom component will display.' +
            ` Try using one of these delimiters: ${delimiters}`);
    }

    private toDocumentFragment(innerHtml: string): DocumentFragment {
        const templateElement: HTMLTemplateElement = document.createElement('template');
        templateElement.innerHTML = innerHtml;
        return templateElement.content;
    }

    private detile(text: string, delimiter: string): string | undefined
    {
        const strings = text.split(delimiter);
        if (strings.length < 3) return undefined;
        const string = strings[1];
        const split = string?.split(delimiter);
        const string1 = split?.[0];
        return string1 ?? text;
    }

    private async getCssStyleSheet(resourceLocationResolver: ResourceLocationResolver) {
        const location = await this.resolveResourceLocation('css', resourceLocationResolver);
        try {
            return await this.cssStyleSheetImporter.getCSSStyleSheet(location);
        }
        catch (error) {
            if (error instanceof NotFound404Error) {
                // TODO re-wrap instructive error
                return undefined;
            }
            throw error;
        }
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
        options?: Partial<CustomaryOptions<T>>
    ) {
        const fetchText: FetchText = FetchText_DOM_singleton;
        const cssStyleSheetImporter = new CSSStyleSheetImporter(fetchText);
        this.cssStyleSheetImporter = cssStyleSheetImporter;
        this.cssStyleSheetAdopter = new CSSStyleSheetAdopter(cssStyleSheetImporter);
        this.fetchText = fetchText;
        this.options = this.getCustomaryOptions(customElementConstructor, options);
    }

    private getCustomaryOptions(
        customElementConstructor: CustomaryCustomElementConstructor<any>,
        options?: Partial<CustomaryOptions<T>>) {
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
        if (options) {
            Object.assign(customaryOptions, options);
        }
        return customaryOptions;
    }

    private readonly options: CustomaryOptions<T>
    private readonly fetchText: FetchText;
    private readonly cssStyleSheetAdopter: CSSStyleSheetAdopter;
    private readonly cssStyleSheetImporter: CSSStyleSheetImporter;

}