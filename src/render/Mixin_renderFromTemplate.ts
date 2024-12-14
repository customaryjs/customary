import {LitElement} from 'lit';
import {CustomaryLit} from "#customary/lit/CustomaryLit.js";
import {html, map} from "lit-for-customary";

type Constructor<T = {}> = new (...args: any[]) => T;

export function Mixin_renderFromTemplate
		<T extends Constructor<LitElement>>(superClass: T): T {
			class Mixin_renderFromTemplate_Class extends superClass {
				// noinspection JSUnusedGlobalSymbols
				protected override render(): unknown {
					const definition = CustomaryLit.getCustomaryDefinition(this);

					const htmlString = this.getHtmlString(definition.template);
					const _state = (this as any).state;
					const _view = definition.hooks?.render?.view?.(_state);

					return this.render_lit_html_TemplateResult(
							htmlString,
							_state,
							_view,
							html,
							map
					);
				}

				private getHtmlString(template: HTMLTemplateElement) {
					// if the template has Lit directives with arrow functions,
					// innerHTML will encode the '>' out of the '=>' so we need to decode it back
					return template.innerHTML.replace('=&gt;', '=>');
				}

				/**
					 lit "html" is a tag function
					 at runtime, the tagged template comes from htmlString
					 only JS compilation can parse the tagged template into a proper function call
					 so we need JS compilation to happen at runtime
					 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates
				 */
				private render_lit_html_TemplateResult(
						htmlString: string,
						_state: any,
						_view: any,
						_html: any,
						_map: any
				) {
					const state = _state;
					const view = _view;
					const html = _html;
					const map = _map;

					return eval(`html\`${htmlString}\``);
				}
			}

			return Mixin_renderFromTemplate_Class as T;
		}
