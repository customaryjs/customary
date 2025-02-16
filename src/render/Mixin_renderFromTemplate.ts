import {LitElement} from '#customary/lit';
import {choose, html, map, when} from "#customary/lit";
import {UncompiledTemplateResult} from "lit-html";
import {getDefinition} from "#customary/CustomaryDefinition.js";

type Constructor<T = {}> = new (...args: any[]) => T;

export function Mixin_renderFromTemplate
		<T extends Constructor<LitElement>>(superClass: T): T {
			class Mixin_renderFromTemplate_Class extends superClass {
				// noinspection JSUnusedGlobalSymbols
				protected override render(): unknown {
					const definition = getDefinition(this);

					const templateResult: UncompiledTemplateResult =
							render_lit_html_TemplateResult(
									this,
									definition.immutable_htmlString,
									(this as any).state
							);

					this.reuse_immutable_TemplateStringsArray(templateResult);

					return templateResult;
				}

				private reuse_immutable_TemplateStringsArray(
						templateResult: UncompiledTemplateResult
				)
				{
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

				private immutable_templateStringsArray: TemplateStringsArray | undefined;
			}

			return Mixin_renderFromTemplate_Class as T;
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
