import {Expressions_recode} from "#customary/expressions/Expressions_recode.js";

export class Attribute_bind {
    static hydrate(template: HTMLTemplateElement)
    {
        const tags = template.content.querySelectorAll(`[${BIND_ATTRIBUTE}]`);
        for (const tag of tags) {
            const binding = tag.getAttribute(BIND_ATTRIBUTE);
            const type = tag.getAttribute('type');
            if (type === 'checkbox') {
                Expressions_recode.setBooleanAttributeExpressionPlaceholder(
                    tag,
                    'checked',
                    '$' + '{' + `this.${binding}` + " === 'true'}"
                );
            }
            else
            {
                Expressions_recode.setPropertyExpressionPlaceholder(
                    tag,
                    'value',
                    '$' + '{' + `this.${binding}` + ' ?? null}'
                );
            }
        }
    }
}
export const BIND_ATTRIBUTE = 'data-customary-bind';
