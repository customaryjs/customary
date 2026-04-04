import {toSelector} from "./toSelector.js";
import {expandCustomaryInterpolation} from "#customary/html/CustomaryHtml.js";

export class LogicTag_classMap
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

            const classInfo = expandCustomaryInterpolation(tag.getAttribute('classInfo') ??
                (() => {
                    throw Error(`Attribute "classInfo" is required for "${tag_name}" tag`)
                })());

            const target = node.querySelector(targetSelector);
            if (!target) {
                throw Error(`Target element "${targetSelector}" not found for "${tag_name}" tag`);
            }

            const existingClass = target.getAttribute('class');
            const classMapDirective = `\${classMap(${classInfo})}`;

            const newClass =
                (existingClass ? `${existingClass} ${classMapDirective}` : classMapDirective).trim();

            if (newClass) {
                target.setAttribute('class', newClass);
            }

            tag.remove();
        }
    }
}
const tag_name = 'customary:classMap';
