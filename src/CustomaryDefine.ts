import {CSSStyleSheetAdopter} from "#customary/cssstylesheet/CSSStyleSheetAdopter.js";
import {CustomaryDefinition} from "#customary/CustomaryDefinition.js";
import {CustomaryDeclaration} from "#customary/CustomaryDeclaration.js";
import {ExternalLoader} from "#customary/external/ExternalLoader.js";
import {FetchText, FetchText_DOM_singleton} from "#customary/fetch/FetchText.js";
import {CSSStyleSheetImporter} from "#customary/cssstylesheet/CSSStyleSheetImporter.js";
import {Markup_for} from "#customary/markup/Markup_for.js";
import {Markup_if} from "#customary/markup/Markup_if.js";
import {Markup_inside} from "#customary/markup/Markup_inside.js";
import {Markup_switch} from "#customary/markup/Markup_switch.js";
import {AttributeProperties} from "#customary/attributes/AttributeProperties.js";
import {StateProperties} from "#customary/state/StateProperties.js";
import {PropertiesProperties} from "#customary/properties/PropertiesProperties.js";
import {LitElement} from "#customary/lit";
import {Attribute_bind} from "#customary/bind/Attribute_bind.js";
import {AttributesDefinition, detectAttributes} from "#customary/attributes/AttributesDefinition.js";
import {ExpressionAttributes} from "#customary/expressions/ExpressionAttributes.js";
import {Expressions_recode} from "#customary/expressions/Expressions_recode.js";

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

		const attributes: AttributesDefinition =
			detectAttributes({config: this.declaration.config, template});

		const cssStyleSheet: CSSStyleSheet | undefined = templateInDocument
				? undefined : await this.loadExternalCSSStyleSheet();

		const customaryDefinition: CustomaryDefinition<T> = {
			declaration: this.declaration,
			attributes: attributes,
			...(cssStyleSheet ? {cssStyleSheet} : {}),
			immutable_htmlString: this.getHtmlString(template),
		};

		CustomaryDefine.addProperties(constructor as typeof LitElement, customaryDefinition);

		return customaryDefinition;
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

	private static addProperties<T extends HTMLElement>(
			constructor: typeof LitElement,
			customaryDefinition: CustomaryDefinition<T>,
	)
	{
		AttributeProperties.addProperties(constructor, customaryDefinition.attributes);
		StateProperties.addProperties(constructor, customaryDefinition.declaration);
		PropertiesProperties.addProperties(constructor, customaryDefinition.declaration);
	}

	private getHtmlString(template: HTMLTemplateElement): string
	{
		this.hydrateBindings(template);
		this.hydrateMarkup(template);

		const s1 = template.innerHTML;
		const s2 = Expressions_recode.recode(s1);
		return recodeMarkup(s2);
	}

	private hydrateBindings(template: HTMLTemplateElement) {
		ExpressionAttributes.hydrate(template);
		Attribute_bind.hydrate(template);
	}

	private hydrateMarkup(template: HTMLTemplateElement) {
		Markup_for.hydrate(template);
		Markup_if.hydrate(template);
		Markup_switch.hydrate(template);

		// must be last to accommodate all others
		Markup_inside.hydrate(template);
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
function recodeMarkup(htmlString: string) {
	// lit directives expressed as arrow functions
	return htmlString.replaceAll('=&gt;', '=>');
}
