import {CustomaryDefinition} from "#customary/CustomaryDefinition.js";
import {appendLinkElement_to_Document} from "#customary/style/CustomaryStylesheets.js";
import {CustomaryDeclaration} from "#customary/CustomaryDeclaration.js";

export class CustomaryFonts {
    static link_fonts(definition: CustomaryDefinition<any>) {
        const declaration = definition.declaration;

        const locations = collect_font_locations(declaration);

        if (!locations) return;

        for (const location of locations) {
            this.link_font(location);
        }
    }

    /**
     * adopter of font stylesheets can only be the root document dom, not the shadow dom.
     * @see https://github.com/microsoft/vscode/issues/159877#issuecomment-1262843952
     * @see https://github.com/mdn/interactive-examples/issues/887#issuecomment-432606925
     */
    private static link_font(location: string) {
        appendLinkElement_to_Document({
            rel: 'preconnect',
            href: 'https://fonts.googleapis.com',
        });
        appendLinkElement_to_Document({
            rel: 'preconnect',
            href: 'https://fonts.gstatic.com',
            linkElementFn: link => link.crossOrigin = "",
        });
        appendLinkElement_to_Document({
            href: location,
            rel: 'stylesheet',
        });
    }
}

function collect_font_locations(declaration: CustomaryDeclaration<any>): string[] {
    return (
        [
            declaration.config?.define?.fontLocation,
            ...(declaration.config?.define?.fontLocations ?? []),
        ]
            .filter(location => location != undefined)
    );
}
