import {CustomaryDefinition} from "#customary/CustomaryDefinition.js";
import {get_import_meta} from "#customary/CustomaryDefine.js";
import {resolveLocation} from "#customary/external/ExternalLoader.js";

export class CustomaryStylesheets {
	constructor(element: HTMLElement) {
		this.element = element;
	}
	private readonly element: HTMLElement;

	link_external_css(definition: CustomaryDefinition<any>) {
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

		const shadowRoot: ShadowRoot | null = findNearestShadowRoot(this.element);
		const rel = 'stylesheet';
		function linkElementFn(link: HTMLLinkElement) {link.type = 'text/css'}

		if (shadowRoot)
		{
			appendLinkElement_to_ShadowRoot(shadowRoot, {href: location, rel, linkElementFn});
		}
		else
		{
			appendLinkElement_to_Document({href: location, rel, linkElementFn});
		}
	}
}

function appendLinkElement_to_ShadowRoot(
	shadowRoot: ShadowRoot,
	options: {
		href: string,
		rel: string,
		linkElementFn: (linkElement: HTMLLinkElement) => void,
	}
) {
	const node: ParentNode = shadowRoot;

	appendLinkElement(node, {
		href: options.href,
		rel: options.rel,
		linkElementFn: options.linkElementFn,
	});
}

export function appendLinkElement_to_Document(
	options: {
		href: string,
		rel: string,
		linkElementFn?: (linkElement: HTMLLinkElement) => void,
	}
) {
	const node: ParentNode = document.head;

	appendLinkElement(node, {
		href: options.href,
		rel: options.rel,
		linkElementFn: options.linkElementFn,
	});
}

export function appendLinkElement(
	parentNode: ParentNode,
	options: {
		href: string,
		rel: string,
		linkElementFn?: (linkElement: HTMLLinkElement) => void | undefined,
	}
)
{
	if (exists_link_href(parentNode, options.href)) return;

	const linkElement: HTMLLinkElement = document.createElement('link');
	linkElement.href = options.href;
	linkElement.rel = options.rel;
	options.linkElementFn?.(linkElement);

	parentNode.appendChild(linkElement);
}

function exists_link_href(parentNode: ParentNode, href: string) {
	return parentNode.querySelector(`link[href="${href}"]`);
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
