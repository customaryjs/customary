import {Expressions_recode} from "#customary/expressions/Expressions_recode.js";

export class ExpressionAttributes
{
    static encodeExpressionPlaceholders(template: HTMLTemplateElement) {
        const tags = Array.from(template.content.querySelectorAll(`[${EXPRESSIONS_ATTRIBUTE}]`));
        for (const tag of tags) {
            const attributeNames = tag.getAttributeNames();
            for (const attributeName of attributeNames) {
                this.encodeExpressionPlaceholder(attributeName, tag);
            }
            tag.removeAttribute(EXPRESSIONS_ATTRIBUTE);
        }
    }

    private static encodeExpressionPlaceholder(attributeName: string, tag: Element) {
        if (!attributeName.startsWith(EXPRESSION_ATTRIBUTE_PREFIX)) {
            return;
        }
        const name = attributeName.substring(EXPRESSION_ATTRIBUTE_PREFIX.length);
        const typeAttributeName = EXPRESSION_TYPE_ATTRIBUTE_PREFIX + name;

        Expressions_recode.encodeExpressionPlaceholder({
            tag,
            name,
            value: tag.getAttribute(attributeName)!,
            type: tag.getAttribute(typeAttributeName) ?? undefined,
        });
        tag.removeAttribute(attributeName);
        tag.removeAttribute(typeAttributeName);
    }
}

const EXPRESSIONS_ATTRIBUTE = 'data-customary-expressions';
const EXPRESSION_ATTRIBUTE_PREFIX = 'data-customary-expression-';
const EXPRESSION_TYPE_ATTRIBUTE_PREFIX = 'data-customary-expression_type-';
