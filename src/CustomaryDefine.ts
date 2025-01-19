import {CSSStyleSheetAdopter} from "#customary/cssstylesheet/CSSStyleSheetAdopter.js";
import {CustomaryDefinition} from "#customary/CustomaryDefinition.js";
import {CustomaryDeclaration} from "#customary/CustomaryDeclaration";
import {CustomaryConfig} from "#customary/CustomaryConfig.js";
import {ExternalLoader} from "#customary/external/ExternalLoader.js";
import {FetchText, FetchText_DOM_singleton} from "#customary/fetch/FetchText.js";
import {CSSStyleSheetImporter} from "#customary/cssstylesheet/CSSStyleSheetImporter.js";
import {Directive_choose} from "#customary/directives/Directive_choose.js";
import {Directive_map} from "#customary/directives/Directive_map.js";
import {Directive_when} from "#customary/directives/Directive_when.js";

export class CustomaryDefine<T extends HTMLElement> {

	async define(): Promise<CustomaryDefinition<T>> {
		const [definition, ] = await Promise.all([
			this.buildCustomaryDefinition(),
			this.adopt_font_cssStyleSheets(),
		])
		return definition;
	}

	private async buildCustomaryDefinition(): Promise<CustomaryDefinition<T>> {
		const declaration: CustomaryDeclaration<T> = this.declaration;

		const templateInDocument: HTMLTemplateElement | undefined =
				findHTMLTemplateElementInDOMDocument(this.name);

		const template: HTMLTemplateElement =
				await this.resolveHTMLTemplateElement(templateInDocument);

		const cssStyleSheet: CSSStyleSheet | undefined =
				await this.resolveCSSStyleSheet(templateInDocument, declaration);

		Directive_choose.hydrate(template);
		Directive_map.hydrate(template);
		Directive_when.hydrate(template);

		const definition: CustomaryDefinition<T> = {
			declaration,
			cssStyleSheet,
			template,
		};

		return prune(definition);
	}

	private async resolveHTMLTemplateElement(
			templateInDocument: HTMLTemplateElement | undefined
	): Promise<HTMLTemplateElement> {
		if (templateInDocument) return templateInDocument;
		try {
			return await this.toTemplate(await this.loadExternalHtml());
		}
		catch (error) {
			throw new Error(
					'template unresolvable from current page or external html',
					{cause: error}
			);
		}
	}

	private async loadExternalHtml(): Promise<string> {
		try {
			return await (await this.externalLoader).loadHtml();
		}
		catch (error) {
			throw new Error('External html file out of reach.', {cause: error});
		}
	}

	private async resolveCSSStyleSheet(
			templateInDocument: HTMLTemplateElement | undefined,
			declaration: CustomaryDeclaration<T>
	): Promise<undefined | CSSStyleSheet> {
		if (templateInDocument) return undefined;
		if (declaration.hooks?.externalLoader?.css_dont) return undefined;
		try {
			return await (await this.externalLoader).loadCssStyleSheet();
		} catch (error) {
			console.debug('External css file out of reach.', {cause: error});
			return undefined;
		}
	}

	private async adopt_font_cssStyleSheets() {
		const locations = ((a: string[]) => a.length > 0 ? a : undefined)(
				[
					this.declaration.config?.define?.fontLocation,
					...(this.declaration.config?.define?.fontLocations ?? []),
				]
						.filter(location => location != undefined)
		);
		if (!locations) return;
		return await (await this.cssStyleSheetAdopter).adoptCSSStylesheets(...locations);
	}

	private async toTemplate(htmlString: string): Promise<HTMLTemplateElement> {
		const tile: string = await this.getTile(htmlString);
		const template: HTMLTemplateElement = document.createElement('template');
		template.innerHTML = tile;
		return template;
	}

	private async getTile(tileset: string) {
		if (this.declaration.config?.define?.detileDont) {
			return tileset;
		}
		const delimiters = ['customary', this.name].map(s => `<!--${s}-->`);
		for (const delimiter of delimiters) {
			const tile: string | undefined = this.detile(tileset, delimiter);
			if (tile) {
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
			private readonly name: string,
			private readonly declaration: CustomaryDeclaration<any>
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
				this.getResourceLocationResolution(this.declaration.config),
				this.fetchText,
				this.cssStyleSheetImporter,
				{
					name: this.name,
					import_meta: this.get_import_meta(),
				}
		);
	}

	private getResourceLocationResolution(config?: CustomaryConfig): ResourceLocationResolution | undefined {
		return config?.define?.resourceLocationResolution
			??
				(
						config?.preset === "recommended"
								?
									{
										kind: "relative",
										pathPrefix: '../',
									}
								:
									undefined
				);
	}

	private get_import_meta() {
		return this.declaration.hooks?.externalLoader?.import_meta ?? (() => {
			throw new Error(`${this.name}: Customary needs "import.meta" if the custom element template ` +
					'is to be loaded from an external file. ' +
					'(document did not have a named template element, and an html string was not provided.)')
		})();
	}

	private _externalLoader: Promise<ExternalLoader> | undefined;

	private get fetchText(): Promise<FetchText> {
		return this._fetchText ??= loadFetchText();
	}

	private _fetchText: Promise<FetchText> | undefined;

}

async function loadCssStyleSheetAdopter(cssStyleSheetImporter: Promise<CSSStyleSheetImporter>): Promise<CSSStyleSheetAdopter> {
	return new CSSStyleSheetAdopter(await cssStyleSheetImporter as any, document);
}

async function loadCssStyleSheetImporter(fetchText: Promise<FetchText>): Promise<CSSStyleSheetImporter> {
	return new CSSStyleSheetImporter(await fetchText);
}

type ResourceLocationResolution = {
	kind: 'flat';
} | {
	kind: 'relative';
	pathPrefix: string;
};

async function loadTilesetLoader(
		resourceLocationResolution: ResourceLocationResolution | undefined,
		fetchText: Promise<FetchText>,
		cssStyleSheetImporter: Promise<CSSStyleSheetImporter>,
		options: {
			name: string,
			import_meta: ImportMeta;
		}
): Promise<ExternalLoader> {
	return new ExternalLoader(
			resourceLocationResolution,
			await fetchText,
			await cssStyleSheetImporter,
			options
	);
}

async function loadFetchText(): Promise<FetchText> {
	return FetchText_DOM_singleton;
}

function prune<T extends { [s: string]: any }>(o: T): T {
	return Object.fromEntries(
			Object.entries(o)
					.filter(([, v]) => !!v)
	) as T;
}

function findHTMLTemplateElementInDOMDocument(name: string): HTMLTemplateElement | undefined {
	return document.querySelector(`template[data-customary-name='${name}']`) as HTMLTemplateElement ?? undefined;
}
