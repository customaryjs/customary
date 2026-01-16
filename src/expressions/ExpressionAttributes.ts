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
        if (!attributeName.startsWith(EXPRESSION_NAME_ATTRIBUTE_PREFIX)) {
            return;
        }
        const ordinal = attributeName.substring(EXPRESSION_NAME_ATTRIBUTE_PREFIX.length);
        const dataAttributeName = EXPRESSION_DATA_ATTRIBUTE_PREFIX + ordinal;
        const typeAttributeName = EXPRESSION_TYPE_ATTRIBUTE_PREFIX + ordinal;

        Expressions_recode.encodeExpressionPlaceholder({
            tag,
            name: tag.getAttribute(attributeName)!,
            data: tag.getAttribute(dataAttributeName)!,
            type: tag.getAttribute(typeAttributeName) ?? undefined,
        });
        tag.removeAttribute(attributeName);
        tag.removeAttribute(dataAttributeName);
        tag.removeAttribute(typeAttributeName);
    }
}

const EXPRESSIONS_ATTRIBUTE = 'data-customary-expressions';
const EXPRESSION_NAME_ATTRIBUTE_PREFIX = 'data-customary-expression-name';
const EXPRESSION_DATA_ATTRIBUTE_PREFIX = 'data-customary-expression-data';
const EXPRESSION_TYPE_ATTRIBUTE_PREFIX = 'data-customary-expression-type';
