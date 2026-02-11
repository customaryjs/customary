import {choose, classMap, html, map, repeat, styleMap, when} from "#customary/lit";
import {UncompiledTemplateResult} from "lit-html";
import {reuse_immutable_TemplateStringsArray} from "#customary/render/reuse_immutable_TemplateStringsArray.js";

/**
 lit "html" is a tag function.
 at runtime, the tagged template comes from htmlString.
 only JS compilation can parse the tagged template into a proper function call,
 so we need JS compilation to happen at runtime.
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates
 */
export function render_lit_html_TemplateResult(
    element: HTMLElement,
    htmlString: string,
    state: any,
): UncompiledTemplateResult
{
    function customary_lit_html_track(html_output: UncompiledTemplateResult): UncompiledTemplateResult {
        reuse_immutable_TemplateStringsArray(element, html_output);
        return html_output;
    }

    const thisArg: HTMLElement = element;
    const fn = new Function(
        'customary_lit_html_track',
        'state', 'html', 'choose', 'classMap', 'map', 'repeat', 'styleMap', 'when',
        '"use strict"; return customary_lit_html_track( html\`' + htmlString + '\`' + ' )'
    );
    return fn.call(
        thisArg,
        customary_lit_html_track,
        state, html, choose, classMap, map, repeat, styleMap, when
    );
}
