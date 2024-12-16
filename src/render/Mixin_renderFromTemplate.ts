import {LitElement} from 'lit';
import {CustomaryLit} from "#customary/lit/CustomaryLit.js";
import {html, map, choose, when} from "lit-for-customary";

type Constructor<T = {}> = new (...args: any[]) => T;

export function Mixin_renderFromTemplate
		<T extends Constructor<LitElement>>(superClass: T): T {
			class Mixin_renderFromTemplate_Class extends superClass {
				// noinspection JSUnusedGlobalSymbols
				protected override render(): unknown {
					const definition = CustomaryLit.getCustomaryDefinition(this);

					const htmlString = recode(definition.template.innerHTML);
					const state = (this as any).state;
					const view = definition.hooks?.render?.view?.(state);

					return render_lit_html_TemplateResult(this, htmlString, state, view);
				}
			}

			return Mixin_renderFromTemplate_Class as T;
		}

/**
 innerHTML encodes some characters used by lit directives
 so we must decode them back into the HTML string.
 over time the need to do this should disappear,
 as we introduce custom elements for lit directives themselves.
*/
function recode(htmlString: string) {
	// lit directives expressed as arrow functions
	return htmlString.replaceAll('=&gt;', '=>');
}

/**
 lit "html" is a tag function.
 at runtime, the tagged template comes from htmlString.
 only JS compilation can parse the tagged template into a proper function call,
 so we need JS compilation to happen at runtime.
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates
*/
function render_lit_html_TemplateResult(
		element: HTMLElement,
		htmlString: string,
		state: any,
		view: any,
) {
	const thisArg = element;
	const fn = new Function(
			'state', 'view', 'html', 'map', 'choose', 'when',
			'"use strict"; return html\`' + htmlString + '\`'
	);
	return fn.call(thisArg, state, view, html, map, choose, when);
}
