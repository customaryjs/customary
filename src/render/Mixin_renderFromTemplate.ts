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

					const _state = (this as any).state;

					const _view = definition.hooks?.render?.view?.(_state);

					const templateResult = this.interpolateVariables(
							definition.template,
							_state,
							_view,
							html,
							map
					);

					return html`${templateResult}`;
				}

				private interpolateVariables(
						template: HTMLTemplateElement,
						_state: any,
						_view: any,
						_html: any,
						_map: any
				) {
					const htmlFromTemplate = template.innerHTML;

					// if the template has Lit directives with arrow functions,
					// innerHTML will encode the '>' out of the '=>' so we need to decode it back
					const htmlWithLitDirectives = htmlFromTemplate.replace('=&gt;', '=>');

					const state = _state;
					const view = _view;
					const html = _html;
					const map = _map;

					const s: string = `html\`${htmlWithLitDirectives}\``;

					const templateResult = eval(s);

					return templateResult;
				}
			}

			return Mixin_renderFromTemplate_Class as T;
		}
