import {toSelector} from "./toSelector.js";
import {expandMarkupExpression} from "#customary/html/CustomaryHtml.js";

export class Markup_classMap
{
    static hydrate(template: HTMLTemplateElement) {
        this.hydrateTree(template.content);
    }

    private static hydrateTree(node: ParentNode)
    {
        while (true) {
            const tag = node.querySelector(toSelector(classMap_markup));
            if (!tag) return;

            this.hydrateTree(tag);

            const targetSelector = tag.getAttribute('target') ??
                (() => {
                    throw Error(`Attribute "target" is required for "${classMap_markup}" markup`)
                })();

            const classInfo = expandMarkupExpression(tag.getAttribute('classInfo') ??
                (() => {
                    throw Error(`Attribute "classInfo" is required for "${classMap_markup}" markup`)
                })());

            const target = node.querySelector(targetSelector);
            if (!target) {
                throw Error(`Target element "${targetSelector}" not found for "${classMap_markup}" markup`);
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
const classMap_markup = 'customary:classMap';
