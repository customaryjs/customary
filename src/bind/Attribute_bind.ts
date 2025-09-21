import {Expressions_recode} from "#customary/expressions/Expressions_recode.js";

export class Attribute_bind {
    static encodeExpressionPlaceholders(template: HTMLTemplateElement)
    {
        const tags = template.content.querySelectorAll(`[${BIND_ATTRIBUTE}]`);
        for (const tag of tags) {
            const binding = tag.getAttribute(BIND_ATTRIBUTE);
            const type = tag.getAttribute('type');
            if (type === 'checkbox') {
                Expressions_recode.encodeExpressionPlaceholder({
                    tag,
                    type: 'boolean',
                    name: 'checked',
                    value: '$' +'{' + `this.${binding}` + " === 'true'}"
                });
            }
            else
            {
                Expressions_recode.encodeExpressionPlaceholder({
                    tag,
                    name: 'value',
                    value: '$' + '{' + `this.${binding}` + ' ?? null}'
                });
            }
        }
    }
}
export const BIND_ATTRIBUTE = 'data-customary-bind';
