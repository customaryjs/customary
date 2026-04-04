import {Attribute_bind} from "#customary/bind/Attribute_bind.js";
import {ExpressionAttributes} from "#customary/expressions/ExpressionAttributes.js";
import {Expressions_recode} from "#customary/expressions/Expressions_recode.js";
import {LogicTag_for} from "#customary/logic/LogicTag_for.js";
import {LogicTag_if} from "#customary/logic/LogicTag_if.js";
import {LogicTag_move_into} from "#customary/logic/LogicTag_move_into.js";
import {LogicTag_classMap} from "#customary/logic/LogicTag_classMap.js";
import {LogicTag_styleMap} from "#customary/logic/LogicTag_styleMap.js";
import {LogicTag_switch} from "#customary/logic/LogicTag_switch.js";

export class CustomaryHtml {
    static getHtmlString(template: HTMLTemplateElement): string
    {
        encodeExpressionPlaceholders(template);
        hydrateLogicTags(template);

        const s = template.innerHTML;

        const s1 = decodeExpressionPlaceholders(s);
        const s2 = restoreArrowFunctionsEncodedByTemplateInnerHtml(s1);
        const s3 = restoreTableTagsEncodedByForBody(s2);
        return expandStringInterpolation(s3);
    }
}

function hydrateLogicTags(template: HTMLTemplateElement) {
    LogicTag_for.hydrate(template);
    LogicTag_if.hydrate(template);
    LogicTag_switch.hydrate(template);
    LogicTag_classMap.hydrate(template);
    LogicTag_styleMap.hydrate(template);

    // must be last to accommodate all others
    LogicTag_move_into.hydrate(template);
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
 as we add logic tags for a larger number of lit directives.
 */
function restoreArrowFunctionsEncodedByTemplateInnerHtml(htmlString: string) {
    // lit directives expressed as arrow functions
    return htmlString.replaceAll('=&gt;', '=>');
}

function restoreTableTagsEncodedByForBody(htmlString: string): string {
    return htmlString
        .replaceAll('&lt;tr&gt;', '<tr>')
        .replaceAll('&lt;/tr&gt;', '</tr>')
        .replaceAll('&lt;td&gt;', '<td>')
        .replaceAll('&lt;/td&gt;', '</td>');
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


export function expandCustomaryInterpolation(expression: string): string {
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
