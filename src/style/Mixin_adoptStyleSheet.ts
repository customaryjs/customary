import {LitElement} from '#customary/lit';
import {CustomaryDefinition, getDefinition} from "#customary/CustomaryDefinition.js";
import {collect_font_locations, get_import_meta} from "#customary/CustomaryDefine.js";
import {resolveLocation} from "#customary/external/ExternalLoader.js";

type Constructor<T = {}> = new (...args: any[]) => T;

export function Mixin_adoptStyleSheet
<T extends Constructor<LitElement>>(superClass: T): T {
	class Mixin_adoptStyleSheet_Class extends superClass {
		// noinspection JSUnusedGlobalSymbols
		override connectedCallback() {
			super.connectedCallback?.();

			const definition = getDefinition(this);

			this.link_external_css(definition);

			this.link_fonts(definition);
		}

		private link_external_css(definition: CustomaryDefinition<any>) {
			if (definition.templateInDocument) return;

			const declaration = definition.declaration;

			if (declaration.hooks?.externalLoader?.css_dont) return;

			const import_meta = get_import_meta(declaration);
			const name = declaration.name!;

			const location: string = resolveLocation({
				import_meta,
				name,
				extension: 'css',
			});

			const shadowRoot: ShadowRoot | null = findNearestShadowRoot(this);

			appendLinkElement(shadowRoot || document, {href: location, id: name});
		}

		/**
		 * adopter of font stylesheets can only be the root document dom, not the shadow dom.
		 * @see https://github.com/microsoft/vscode/issues/159877#issuecomment-1262843952
		 * @see https://github.com/mdn/interactive-examples/issues/887#issuecomment-432606925
		 */
		private link_fonts(definition: CustomaryDefinition<any>) {
			const declaration = definition.declaration;

			const locations = collect_font_locations(declaration);

			if (!locations) return;

			for (const location of locations) {
				appendLinkElement(document, {href: location, id: `customary-fontLocation-${location}`});
			}
		}
	}
	return Mixin_adoptStyleSheet_Class;
}

function appendLinkElement(
	host: ShadowRoot | Document,
	options: {
		href: string,
		id: string,
	}
)
{
	const id = options.id;

	const exists = host instanceof ShadowRoot ? host.getElementById(id) : host.getElementById(id);

	if (exists) return;

	const node = host instanceof ShadowRoot ? host : host.head;

	const linkElement = document.createElement('link');
	linkElement.href = options.href;
	linkElement.id = id;
	linkElement.rel = 'stylesheet';
	linkElement.type = 'text/css';

	node.appendChild(linkElement);
}

function findNearestShadowRoot(element: Element): ShadowRoot | null {
	if (element.shadowRoot) return element.shadowRoot;
	let parentNode = element.parentNode;
	while (parentNode) {
		if (parentNode instanceof ShadowRoot) {
			return parentNode;
		}
		parentNode = parentNode.parentNode;
	}
	return null;
}
