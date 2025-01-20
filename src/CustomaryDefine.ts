import {CSSStyleSheetAdopter} from "#customary/cssstylesheet/CSSStyleSheetAdopter.js";
import {CustomaryDefinition} from "#customary/CustomaryDefinition.js";
import {CustomaryDeclaration} from "#customary/CustomaryDeclaration.js";
import {ExternalLoader} from "#customary/external/ExternalLoader.js";
import {FetchText, FetchText_DOM_singleton} from "#customary/fetch/FetchText.js";
import {CSSStyleSheetImporter} from "#customary/cssstylesheet/CSSStyleSheetImporter.js";
import {Directive_choose} from "#customary/directives/Directive_choose.js";
import {Directive_map} from "#customary/directives/Directive_map.js";
import {Directive_when} from "#customary/directives/Directive_when.js";
import {AttributeProperties} from "#customary/attributes/AttributeProperties.js";
import {StateProperties} from "#customary/state/StateProperties.js";
import {PropertiesProperties} from "#customary/properties/PropertiesProperties.js";
import {LitElement} from "#customary/lit";

export class CustomaryDefine<T extends HTMLElement> {

	async define(constructor: CustomElementConstructor): Promise<CustomaryDefinition<T>> {
		const [definition, ] = await Promise.all([
			this.buildDefinition(constructor),
			this.adopt_font_cssStyleSheets(),
		])
		return definition;
	}

	private async buildDefinition(
			constructor: CustomElementConstructor
	): Promise<CustomaryDefinition<T>>
	{
		const {template, templateInDocument} =
				await this.resolveHTMLTemplateElement(this.name);

		this.addProperties(constructor as typeof LitElement, template);

		const cssStyleSheet: CSSStyleSheet | undefined = templateInDocument
				? undefined : await this.loadExternalCSSStyleSheet();

		return {
			immutable_htmlString: this.getHtmlString(template),
			...(cssStyleSheet ? {cssStyleSheet} : {}),
			declaration: this.declaration,
		};
	}

	private async resolveHTMLTemplateElement(
			name: string
	): Promise<{
		templateInDocument: HTMLTemplateElement | undefined;
		template: HTMLTemplateElement;
	}> {
		try {
			const templateInDocument: HTMLTemplateElement | undefined =
					findHTMLTemplateElement(name, document);

			if (templateInDocument) return {
				template: templateInDocument,
				templateInDocument,
			};

			const templateInExternalFile: HTMLTemplateElement =
					await this.findHTMLTemplateElementInExternalFile(name);

			return {
				template: templateInExternalFile,
				templateInDocument: undefined,
			}
		}
		catch (error) {
			throw new Error(
					'template unresolvable from current page or external html',
					{cause: error}
			);
		}
	}

	private addProperties(
			constructor: typeof LitElement,
			template: HTMLTemplateElement
	)
	{
		AttributeProperties.addProperties(constructor, this.declaration, template);
		StateProperties.addProperties(constructor, this.declaration);
		PropertiesProperties.addProperties(constructor, this.declaration);
	}

	private getHtmlString(template: HTMLTemplateElement): string
	{
		Directive_choose.hydrate(template);
		Directive_map.hydrate(template);
		Directive_when.hydrate(template);
		return recode(template.innerHTML);
	}

	private async findHTMLTemplateElementInExternalFile(
			name: string
	): Promise<HTMLTemplateElement> {
		const htmlString = await this.loadExternalHtml();
		const template: HTMLTemplateElement = document.createElement('template');
		template.innerHTML = htmlString;
		return findHTMLTemplateElement(name, template.content) ?? template;
	}

	private async loadExternalHtml(): Promise<string> {
		try {
			return await (await this.externalLoader).loadHtml();
		}
		catch (error) {
			throw new Error('External html file out of reach.', {cause: error});
		}
	}

	private async loadExternalCSSStyleSheet(): Promise<undefined | CSSStyleSheet> {
		if (this.declaration.hooks?.externalLoader?.css_dont) return undefined;
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

	constructor(private readonly declaration: CustomaryDeclaration<any>) {}
	private readonly name: string = this.declaration.name!;

	private get cssStyleSheetImporter(): Promise<CSSStyleSheetImporter> {
		return this._cssStyleSheetImporter ??= loadCssStyleSheetImporter(this.fetchText);
	}

	private _cssStyleSheetImporter: Promise<CSSStyleSheetImporter> | undefined;

	private get cssStyleSheetAdopter(): Promise<CSSStyleSheetAdopter> {
		return this._cssStyleSheetAdopter ??= loadCssStyleSheetAdopter(this.cssStyleSheetImporter);
	}

	private _cssStyleSheetAdopter: Promise<CSSStyleSheetAdopter> | undefined;

	private get externalLoader(): Promise<ExternalLoader> {
		return this._externalLoader ??= createExternalLoader(
				this.fetchText,
				this.cssStyleSheetImporter,
				{
					name: this.name,
					import_meta: this.get_import_meta(),
				}
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

async function createExternalLoader(
		fetchText: Promise<FetchText>,
		cssStyleSheetImporter: Promise<CSSStyleSheetImporter>,
		options: {
			name: string,
			import_meta: ImportMeta;
		}
): Promise<ExternalLoader> {
	return new ExternalLoader(
			await fetchText,
			await cssStyleSheetImporter,
			options
	);
}

async function loadFetchText(): Promise<FetchText> {
	return FetchText_DOM_singleton;
}

function findHTMLTemplateElement(name: string, node: ParentNode): HTMLTemplateElement | undefined {
	return node.querySelector(`template[data-customary-name='${name}']`) as HTMLTemplateElement ?? undefined;
}

/**
 innerHTML encodes some characters used by lit directives
 so we must decode them back into the HTML string.
 over time the need to do this should disappear,
 as we add directive markup for a larger number of lit directives.
 */
function recode(htmlString: string) {
	// lit directives expressed as arrow functions
	return htmlString.replaceAll('=&gt;', '=>');
}
