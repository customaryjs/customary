import {Attribute_bind} from "#customary/bind/Attribute_bind.js";
import {ExpressionAttributes} from "#customary/expressions/ExpressionAttributes.js";
import {Expressions_recode} from "#customary/expressions/Expressions_recode.js";
import {Markup_for} from "#customary/markup/Markup_for.js";
import {Markup_if} from "#customary/markup/Markup_if.js";
import {Markup_inside} from "#customary/markup/Markup_inside.js";
import {Markup_classMap} from "#customary/markup/Markup_classMap.js";
import {Markup_styleMap} from "#customary/markup/Markup_styleMap.js";
import {Markup_switch} from "#customary/markup/Markup_switch.js";

export class CustomaryHtml {
    static getHtmlString(template: HTMLTemplateElement): string
    {
        encodeExpressionPlaceholders(template);
        hydrateMarkup(template);

        const s = template.innerHTML;

        const s1 = decodeExpressionPlaceholders(s);
        const s2 = restoreArrowFunctionsEncodedByTemplateInnerHtml(s1);
        return expandStringInterpolation(s2);
    }
}

function hydrateMarkup(template: HTMLTemplateElement) {
    Markup_for.hydrate(template);
    Markup_if.hydrate(template);
    Markup_switch.hydrate(template);
    Markup_classMap.hydrate(template);
    Markup_styleMap.hydrate(template);

    // must be last to accommodate all others
    Markup_inside.hydrate(template);
}

function encodeExpressionPlaceholders(template: HTMLTemplateElement) {
    ExpressionAttributes.encodeExpressionPlaceholders(template);
    Attribute_bind.encodeExpressionPlaceholders(template);
}

function decodeExpressionPlaceholders(s1: string) {
    return Expressions_recode.decodeExpressionPlaceholders(s1);
}

/**
 innerHTML encodes some characters used by lit directives,
 so we must decode them back into the HTML string.
 over time the need to do this should disappear,
 as we add directive markup for a larger number of lit directives.
 */
function restoreArrowFunctionsEncodedByTemplateInnerHtml(htmlString: string) {
    // lit directives expressed as arrow functions
    return htmlString.replaceAll('=&gt;', '=>');
}

function expandStringInterpolation(htmlString: string): string {
    const curl_curley = /\{\{([a-zA-Z_][\w-]*(?:\.[a-zA-Z_][\w-]*)*)}}/g;
    const curl_square = /\{\[([a-zA-Z_][\w-]*(?:\.[a-zA-Z_][\w-]*)*)]}/g;

    return htmlString
        .replace(
            curl_curley,
            (_match, path) => "${" + expandThisInterpolation(path) + "}"
        )
        .replace(
            curl_square,
            (_match, path) => "${" + expandBareInterpolation(path) + "}"
        );
}


export function expandMarkupExpression(expression: string): string {
    const curl_curley = /^\{\{([a-zA-Z_][\w-]*(?:\.[a-zA-Z_][\w-]*)*)}}$/;
    const curl_square = /^\{\[([a-zA-Z_][\w-]*(?:\.[a-zA-Z_][\w-]*)*)]}$/;

    const that = expression.match(curl_curley);
    if (that) {
        return expandThisInterpolation(that[1]);
    }

    const bare = expression.match(curl_square);
    if (bare) {
        return expandBareInterpolation(bare[1]);
    }

    throw new Error(`Interpolation required: ${expression}`);
}

function expandThisInterpolation(path: string): string {
    return "this" +
        path.split('.')
            .map(p => "['" + p + "']")
            .join('?.');
}

function expandBareInterpolation(path: string): string {
    const segments = path.split('.');

    return segments[0] +
        segments.slice(1)
            .map(p => "['" + p + "']")
            .join('?.');
}
