import {LitElement} from 'lit';
import {choose, html, map, when} from "#customary/lit";
import {UncompiledTemplateResult} from "lit-html";
import {CustomaryRegistry} from "#customary/registry/CustomaryRegistry.js";

type Constructor<T = {}> = new (...args: any[]) => T;

export function Mixin_renderFromTemplate
		<T extends Constructor<LitElement>>(superClass: T): T {
			class Mixin_renderFromTemplate_Class extends superClass {
				// noinspection JSUnusedGlobalSymbols
				protected override render(): unknown {
					const element = this;

					const htmlString = this.immutable_htmlString ??= this.resolve_htmlString();

					const state = (element as any).state;

					const templateResult: UncompiledTemplateResult =
							render_lit_html_TemplateResult(element, htmlString, state);

					this.reuse_immutable_TemplateStringsArray(templateResult);

					return templateResult;
				}

				private resolve_htmlString(): string {
					const definition = CustomaryRegistry.getCustomaryDefinition(this);
					// FIXME recode on define, only once. this string must never ever change
					return recode(definition.template.innerHTML);
				}

				private reuse_immutable_TemplateStringsArray(templateResult: UncompiledTemplateResult) {
					const templateStringsArray = templateResult.strings;

					if (!this.immutable_templateStringsArray) {
						this.immutable_templateStringsArray = templateStringsArray;
						return;
					}

					for (let i = 0; i < templateStringsArray.length; i++) {
						if (templateStringsArray[i] !== this.immutable_templateStringsArray[i]) {
							throw new Error(`
Original html first registered only once from named template tag in page
(or first registered only once from external html file)
could not have possibly changed structure inbetween calls to render.... tampering??
(see https://github.com/lit/lit/pull/3987)
`);
						}
					}

					templateResult.strings = this.immutable_templateStringsArray;
				}

				private immutable_htmlString: string | undefined;
				private immutable_templateStringsArray: TemplateStringsArray | undefined;
			}

			return Mixin_renderFromTemplate_Class as T;
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
): UncompiledTemplateResult {
	const thisArg = element;
	const fn = new Function(
			'state', 'html', 'map', 'choose', 'when',
			'"use strict"; return html\`' + htmlString + '\`'
	);
	return fn.call(thisArg, state, html, map, choose, when);
}
