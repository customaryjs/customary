// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomaryDefinition} from "customary/CustomaryDefinition.js";
// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {CustomaryOptions} from "customary/CustomaryOptions.js";

export class CustomaryDefine {

    async define() {
        const [definition, ] = await Promise.all([
            this.buildCustomaryDefinition(),
            this.adopt_font_cssStyleSheets(),
        ])
        return definition;
    }

    private async buildCustomaryDefinition(): Promise<CustomaryDefinition> {
        const templateDefinition = await this.getTemplateDefinition();

        return {
            documentFragment: templateDefinition.template.content,
            cssStyleSheet: templateDefinition.cssStyleSheet,
            constructOptions: this.options.constructOptions,
            slotOptions: this.options.slotOptions,
            attributeOptions: this.options.attributeOptions,
        };
    }

    private async getTemplateDefinition(): Promise<TemplateDefinition> {
        const templates: HTMLCollectionOf<HTMLTemplateElement> = document.getElementsByTagName("template");
        const template = templates.namedItem(this.options.name) ?? templates[0];

        if (template) {
            return {template, cssStyleSheet: undefined};
        }

        if (this.options.fromHtml) {
            return {
                template: await this.toTemplate(await this.options.fromHtml()),
                cssStyleSheet: await this.loadCssStyleSheet(),
            };
        }

        return {
            template: await this.toTemplate(await (await this.externalLoader).loadHtml()),
            cssStyleSheet: await this.loadCssStyleSheet(),
        };
    }

    private async loadCssStyleSheet() {
        return await (await this.externalLoader).loadCssStyleSheet();
    }

    private async adopt_font_cssStyleSheets() {
        const locations = ((a: string[]) => a.length > 0 ? a : undefined)(
            [
                this.options.defineOptions?.fontLocation,
                ...(this.options.defineOptions?.fontLocations ?? []),
            ]
                .filter(location => location != undefined)
        );
        if (!locations) return;
        return await (await this.cssStyleSheetAdopter).adoptCSSStylesheets(...locations);
    }

    private async toTemplate(tileset: string) {
        const tile: string = await this.getTile(tileset);
        const template: HTMLTemplateElement = document.createElement('template');
        template.innerHTML = tile;
        return template;
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

    private detile(text: string, delimiter: string): string | undefined
    {
        const strings = text.split(delimiter);
        if (strings.length < 3) return undefined;
        const string = strings[1];
        const split = string?.split(delimiter);
        const string1 = split?.[0];
        return string1 ?? text;
    }

    constructor(
        private readonly options: CustomaryOptions<any>
    ) {}

    private get cssStyleSheetImporter(): Promise<CSSStyleSheetImporter> {
        return this._cssStyleSheetImporter ??= loadCssStyleSheetImporter(this.fetchText);
    }

    private _cssStyleSheetImporter: Promise<CSSStyleSheetImporter> | undefined;

    private get cssStyleSheetAdopter(): Promise<CSSStyleSheetAdopter> {
        return this._cssStyleSheetAdopter ??= loadCssStyleSheetAdopter(this.cssStyleSheetImporter);
    }

    private _cssStyleSheetAdopter: Promise<CSSStyleSheetAdopter> | undefined;

    private get externalLoader(): Promise<ExternalLoader> {
        return this._externalLoader ??= loadTilesetLoader(
            this.options.defineOptions?.resourceLocationResolution,
            this.fetchText,
            this.cssStyleSheetImporter,
            {
                name: this.options.name,
                import_meta: this.options.import_meta ?? (()=>{throw new Error()})(),
            }
        );
    }

    private _externalLoader: Promise<ExternalLoader> | undefined;

    private get fetchText(): Promise<FetchText> {
        return this._fetchText ??= loadFetchText();
    }

    private _fetchText: Promise<FetchText> | undefined;
}

async function loadCssStyleSheetAdopter(cssStyleSheetImporter: Promise<CSSStyleSheetImporter>): Promise<CSSStyleSheetAdopter> {
    const {CSSStyleSheetAdopter} = await import("customary/cssstylesheet/CSSStyleSheetAdopter.js");
    return new CSSStyleSheetAdopter(await cssStyleSheetImporter, document);
}

async function loadCssStyleSheetImporter(fetchText: Promise<FetchText>): Promise<CSSStyleSheetImporter> {
    const {CSSStyleSheetImporter} = await import("customary/cssstylesheet/CSSStyleSheetImporter.js");
    return new CSSStyleSheetImporter(await fetchText);
}

interface CSSStyleSheetImporter {
    getCSSStyleSheet(location: string): Promise<CSSStyleSheet | undefined>;
}

interface CSSStyleSheetAdopter {
    adoptCSSStylesheets(...locations: string[]): Promise<void>;
}

type TemplateDefinition = {
    template: HTMLTemplateElement;
    cssStyleSheet: CSSStyleSheet | undefined;
}

async function loadTilesetLoader(
    resourceLocationResolution: {
        kind: 'flat';
    } | {
        kind: 'relative';
        pathPrefix: string;
    } | undefined,
    fetchText: Promise<FetchText>,
    cssStyleSheetImporter: Promise<CSSStyleSheetImporter>,
    options: {
    name: string,
        import_meta: ImportMeta;
}
): Promise<ExternalLoader> {
    const {ExternalLoader} = await import("customary/external/ExternalLoader.js");
    return new ExternalLoader(
        resourceLocationResolution,
        await fetchText,
        await cssStyleSheetImporter,
        options
    );
}

interface ExternalLoader {
    loadHtml(): Promise<string>;
    loadCssStyleSheet(): Promise<undefined | CSSStyleSheet>;
}

export interface FetchText {
    fetchText(input: RequestInfo | URL): Promise<string>;
}

async function loadFetchText(): Promise<FetchText> {
    const {FetchText_DOM_singleton} = await import("customary/fetch/FetchText.js");
    return FetchText_DOM_singleton;
}
