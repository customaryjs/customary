import {LitElement} from 'lit';
import {CustomaryLit} from "#customary/lit/CustomaryLit.js";

type Constructor<T = {}> = new (...args: any[]) => T;
type PropertyValues = Map<PropertyKey, unknown>;

export const Mixin_firstUpdated =
		<T extends Constructor<LitElement>>(superClass: T) => {
			class MixinClass_firstUpdated extends superClass {
				protected override firstUpdated(changedProperties: PropertyValues) {
					super.firstUpdated(changedProperties);

					const element = this;
					const definition = CustomaryLit.getCustomaryDefinition(element);

					definition.hooks?.lifecycle?.firstUpdated?.(element, changedProperties);
				}
			}
			return MixinClass_firstUpdated as T;
		}
