import {LitElement} from "#customary/lit";
import {CustomaryDefinition} from "#customary/CustomaryDefinition.js";
import {CustomaryDeclaration} from "#customary/CustomaryDeclaration.js";
import {ExternalLoader} from "#customary/external/ExternalLoader.js";
import {FetchText, FetchText_DOM_singleton} from "#customary/fetch/FetchText.js";
import {CustomaryHtml} from "#customary/html/CustomaryHtml.js";
import {AttributesDefinition, detectAttributes} from "#customary/attributes/AttributesDefinition.js";
import {CustomaryProperties} from "#customary/CustomaryProperties.js";

export class CustomaryDefine<T extends HTMLElement> {

	async define(constructor: CustomElementConstructor): Promise<CustomaryDefinition<T>> {
		return await this.buildDefinition(constructor);
	}

	private async buildDefinition(
			constructor: CustomElementConstructor
	): Promise<CustomaryDefinition<T>>
	{
		const {template, templateInDocument} =
				await this.resolveHTMLTemplateElement(this.name);

		const attributes: AttributesDefinition =
			detectAttributes({config: this.declaration.config, template});

		const customaryDefinition: CustomaryDefinition<T> = {
			declaration: this.declaration,
			attributes: attributes,
			templateInDocument: !!templateInDocument,
			immutable_htmlString: CustomaryHtml.getHtmlString(template),
		};

		CustomaryProperties.addProperties(constructor as typeof LitElement, customaryDefinition);

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
            const message = `${name}: template unresolvable from current page or external html`;
            async function unresolvable() {
                throw new Error(message, {cause: error});
            }
            void unresolvable();
            const templatePlaceholder = document.createElement('template');
            templatePlaceholder.innerHTML = `<span style="color: red; background: yellow">[${message}]</span>`;
            return {
                template: templatePlaceholder,
                templateInDocument: templatePlaceholder,
            }
		}
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

	constructor(private readonly declaration: CustomaryDeclaration<any>)
	{
		this.name = declaration.name!;
	}
	private readonly name: string;

	private get externalLoader(): Promise<ExternalLoader> {
		return this._externalLoader ??= createExternalLoader(
				this.fetchText,
				{
					name: this.name,
					import_meta: get_import_meta(this.declaration),
				}
		);
	}

	private _externalLoader: Promise<ExternalLoader> | undefined;

	private get fetchText(): Promise<FetchText> {
		return this._fetchText ??= loadFetchText();
	}

	private _fetchText: Promise<FetchText> | undefined;

}

async function createExternalLoader(
		fetchText: Promise<FetchText>,
		options: {
			name: string,
			import_meta: ImportMeta;
		}
): Promise<ExternalLoader> {
	return new ExternalLoader(
			await fetchText,
			options
	);
}

async function loadFetchText(): Promise<FetchText> {
	return FetchText_DOM_singleton;
}

function findHTMLTemplateElement(name: string, node: ParentNode): HTMLTemplateElement | undefined {
	return node.querySelector(`template[data-customary-name='${name}']`) as HTMLTemplateElement ?? undefined;
}

export function get_import_meta(declaration: CustomaryDeclaration<any>) {
	return declaration.hooks?.externalLoader?.import_meta ?? (() => {
		throw new Error(`${declaration.name}: Customary needs "import.meta" if the custom element template ` +
			'is to be loaded from an external file. ' +
			'(document did not have a named template element, and an html string was not provided.)')
	})();
}

export function collect_font_locations(declaration: CustomaryDeclaration<any>): string[] | undefined {
	return ((a: string[]) => a.length > 0 ? a : undefined)(
		[
			declaration.config?.define?.fontLocation,
			...(declaration.config?.define?.fontLocations ?? []),
		]
			.filter(location => location != undefined)
	);
}
