import {LitElement} from '#customary/lit';
import {reuse_immutable_TemplateStringsArray} from "#customary/render/reuse_immutable_TemplateStringsArray.js";
import {render_lit_html_TemplateResult} from "#customary/render/render_lit_html_TemplateResult.js";
import {getDefinition} from "#customary/CustomaryDefinition.js";
import {UncompiledTemplateResult} from "lit-html";

type Constructor<T = {}> = new (...args: any[]) => T;

export function Mixin_renderFromTemplate
		<T extends Constructor<LitElement>>(superClass: T): T {
			class Mixin_renderFromTemplate_Class extends superClass {
				// noinspection JSUnusedGlobalSymbols
				protected override render(): unknown {
					const definition = getDefinition(this);

					return render_lit_html_TemplateResult(
						this,
						definition.immutable_htmlString,
						(this as any).state
					);
				}
			}

			return Mixin_renderFromTemplate_Class as T;
		}
