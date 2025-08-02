export class Expressions_recode
{
    static setBooleanAttributeExpressionPlaceholder(tag: Element, name: string, value: string)
    {
        tag.setAttribute(`${LIT_BOOLEAN_ATTRIBUTE_EXPRESSION_PREFIX}${name}`, value);
    }

    static setPropertyExpressionPlaceholder(tag: Element, name: string, value: string)
    {
        tag.setAttribute(`${LIT_PROPERTY_EXPRESSION_PREFIX}${name}`, value);

    }

    static recode(htmlString: string) {
        const s1 = htmlString.replaceAll(LIT_PROPERTY_EXPRESSION_PREFIX, '.');
        return s1.replaceAll(LIT_BOOLEAN_ATTRIBUTE_EXPRESSION_PREFIX, '?');
    }
}

// lowercase because setAttribute would lowercase it regardless
const LIT_PROPERTY_EXPRESSION_PREFIX =
    '____lit_property_expression_prefix____';
const LIT_BOOLEAN_ATTRIBUTE_EXPRESSION_PREFIX =
    '____lit_boolean_attribute_expression_prefix____';
