import {toSelector} from "./toSelector.js";

export class Markup_styleMap
{
    static hydrate(template: HTMLTemplateElement) {
        this.hydrateTree(template.content);
    }

    private static hydrateTree(node: ParentNode)
    {
        while (true) {
            const tag = node.querySelector(toSelector(styleMap_markup));
            if (!tag) return;

            this.hydrateTree(tag);

            const targetSelector = tag.getAttribute('target') ??
                (() => {
                    throw Error(`Attribute "target" is required for "${styleMap_markup}" markup`)
                })();

            const styleInfo = tag.getAttribute('styleInfo') ??
                (() => {
                    throw Error(`Attribute "styleInfo" is required for "${styleMap_markup}" markup`)
                })();

            const target = node.querySelector(targetSelector);
            if (!target) {
                throw Error(`Target element "${targetSelector}" not found for "${styleMap_markup}" markup`);
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
const styleMap_markup = 'customary:styleMap';
