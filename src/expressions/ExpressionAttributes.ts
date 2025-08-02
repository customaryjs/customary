import {Expressions_recode} from "#customary/expressions/Expressions_recode.js";

export class ExpressionAttributes
{
    static hydrate(template: HTMLTemplateElement) {
        const tags = Array.from(template.content.querySelectorAll(`[${EXPRESSIONS_ATTRIBUTE}]`));
        for (const tag of tags) {
            const names = tag.getAttributeNames()
                .filter(name => name.startsWith(EXPRESSION_ATTRIBUTE_PREFIX));
            for (const name of names) {
                Expressions_recode.setPropertyExpressionPlaceholder(tag, name.substring(LENGTH), tag.getAttribute(name)!);
                tag.removeAttribute(name);
            }
            tag.removeAttribute(EXPRESSIONS_ATTRIBUTE);
        }
    }
}

const EXPRESSIONS_ATTRIBUTE = 'data-customary-expressions';
const EXPRESSION_ATTRIBUTE_PREFIX = 'data-customary-expression-';
const LENGTH = EXPRESSION_ATTRIBUTE_PREFIX.length;
