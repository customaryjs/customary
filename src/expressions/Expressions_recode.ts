type ExpressionType = 'boolean' | 'event' | 'property';

export class Expressions_recode
{
    static encodeExpressionPlaceholder(
        {
            type, tag, name, value,
        }:{
            type?: string, tag: Element, name: string, value: string
        }
    ) {
        const prefix = TYPE_x_PREFIX[this.toExpressionType(name, type)];
        tag.setAttribute(`${prefix}${name}`, value);
    }

    static decodeExpressionPlaceholders(htmlString: string) {
        Object.entries(SYMBOL_x_PREFIX).forEach(([symbol, prefix]) => {
            htmlString = htmlString.replaceAll(prefix, symbol);
        });
        return htmlString;
    }

    private static toExpressionType(name: string, s?: string): ExpressionType {
        if (!s) return 'property';
        if (s === 'boolean' || s === 'event') return s;
        throw new Error(`Unknown expression type "${s}" for attribute "${name}"`);
    }
}

// lowercase because setAttribute would lowercase it regardless
const LIT_BOOLEAN_ATTRIBUTE_EXPRESSION_PREFIX =
    '____lit_boolean_attribute_expression_prefix____';
const LIT_EVENT_EXPRESSION_PREFIX =
    '____lit_event_expression_prefix____';
const LIT_PROPERTY_EXPRESSION_PREFIX =
    '____lit_property_expression_prefix____';

const TYPE_x_PREFIX: Record<ExpressionType, string> = {
    'boolean': LIT_BOOLEAN_ATTRIBUTE_EXPRESSION_PREFIX,
    'event': LIT_EVENT_EXPRESSION_PREFIX,
    'property': LIT_PROPERTY_EXPRESSION_PREFIX,
}

const SYMBOL_x_PREFIX = {
    '?': LIT_BOOLEAN_ATTRIBUTE_EXPRESSION_PREFIX,
    '@': LIT_EVENT_EXPRESSION_PREFIX,
    '.': LIT_PROPERTY_EXPRESSION_PREFIX,
}
