export class Attribute_bind {
    static hydrate(template: HTMLTemplateElement)
    {
        const tags = template.content.querySelectorAll(`[${BIND_ATTRIBUTE}]`);
        for (const tag of tags) {
            const binding = tag.getAttribute(BIND_ATTRIBUTE);
            const type = tag.getAttribute('type');
            if (type === 'checkbox') {
                tag.setAttribute(
                    LIT_PROPERTY_EXPRESSION_CHECKED_ATTR,
                    '$' + '{' + `this.${binding}` + " === 'true'}"
                );
            }
            else
            {
                tag.setAttribute(
                    LIT_PROPERTY_EXPRESSION_VALUE_ATTR,
                    '$' + '{' + `this.${binding}` + ' ?? null}'
                );
            }
        }
    }

    static recode(htmlString: string) {
        const s1 = htmlString.replaceAll(LIT_PROPERTY_EXPRESSION_VALUE_ATTR, '.value');
        return s1.replaceAll(LIT_PROPERTY_EXPRESSION_CHECKED_ATTR, '?checked');
    }
}

// lowercase because setAttribute would lowercase it regardless
const LIT_PROPERTY_EXPRESSION_VALUE_ATTR =
    '____lit_property_expression_value_attr____';
const LIT_PROPERTY_EXPRESSION_CHECKED_ATTR =
    '____lit_property_expression_checked_attr____';

export const BIND_ATTRIBUTE = 'data-customary-bind';
