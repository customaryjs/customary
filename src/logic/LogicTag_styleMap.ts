import {toSelector} from "./toSelector.js";
import {expandCustomaryInterpolation} from "#customary/html/CustomaryHtml.js";

export class LogicTag_styleMap
{
    static hydrate(template: HTMLTemplateElement) {
        this.hydrateTree(template.content);
    }

    private static hydrateTree(node: ParentNode)
    {
        while (true) {
            const tag = node.querySelector(toSelector(tag_name));
            if (!tag) return;

            this.hydrateTree(tag);

            const targetSelector = tag.getAttribute('target') ??
                (() => {
                    throw Error(`Attribute "target" is required for "${tag_name}" tag`)
                })();

            const styleInfo = expandCustomaryInterpolation(tag.getAttribute('styleInfo') ??
                (() => {
                    throw Error(`Attribute "styleInfo" is required for "${tag_name}" tag`)
                })());

            const target = node.querySelector(targetSelector);
            if (!target) {
                throw Error(`Target element "${targetSelector}" not found for "${tag_name}" tag`);
            }

            const existingStyle = target.getAttribute('style');
            const styleMapDirective = `\${styleMap(${styleInfo})}`;

            const newStyle =
                (existingStyle ? `${existingStyle} ${styleMapDirective}` : styleMapDirective).trim();

            if (newStyle) {
                target.setAttribute('style', newStyle);
            }

            tag.remove();
        }
    }
}
const tag_name = 'customary:styleMap';
