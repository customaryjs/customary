import {FetchText} from "customary/fetch/FetchText.js";
import {NotFound404Error} from "customary/fetch/NotFound404Error.js";

interface CSSStyleSheetImporter {
    getCSSStyleSheet(location: string): Promise<CSSStyleSheet | undefined>;
}

export class ExternalLoader {
    constructor(
        private readonly resourceLocationResolution: ResourceLocationResolution | undefined,
        private readonly fetchText: FetchText,
        private readonly cssStyleSheetImporter: CSSStyleSheetImporter,
        private readonly options: {
            name: string,
            import_meta: ImportMeta;
        }
    ) {
        this.resourceLocationResolver = ExternalLoader.getResourceLocationResolver(this.resourceLocationResolution);
    }

    private readonly resourceLocationResolver: ResourceLocationResolver;

    private static getResourceLocationResolver(resourceLocationResolution: ResourceLocationResolution | undefined) {
        switch (resourceLocationResolution?.kind) {
            case "relative":
                return new RelativeResourceLocationResolver(resourceLocationResolution.pathPrefix);
            case "flat":
            default:
                return new FlatResourceLocationResolver();
        }
    }

    async loadHtml(): Promise<string> {
        const location = this.resolveResourceLocation('html');
        try {
            return await this.fetchText.fetchText(location);
        } catch (error) {
            if (error instanceof NotFound404Error) {
                // TODO re-wrap as an instructive error
                throw error;
            } else
                throw error;
        }
    }

    async loadCssStyleSheet(): Promise<undefined | CSSStyleSheet> {
        const location = this.resolveResourceLocation('css');
        try {
            return await this.cssStyleSheetImporter.getCSSStyleSheet(location);
        } catch (error) {
            if (error instanceof NotFound404Error) {
                // TODO re-wrap instructive error
                return undefined;
            }
            throw error;
        }
    }

    private resolveResourceLocation(
        extension: string
    ): string {
        const specified = this.resourceLocationResolver.resolveResourceLocation(`${this.options.name}.${extension}`);
        return this.options.import_meta.resolve(specified);
    }

}


type ResourceLocationResolution = FlatResourceLocationResolution | RelativeResourceLocationResolution;

type FlatResourceLocationResolution = {
    kind: 'flat';
}

type RelativeResourceLocationResolution = {
    kind: 'relative';
    pathPrefix: string;
}

export interface ResourceLocationResolver {
    resolveResourceLocation(name: string): string;
}


class FlatResourceLocationResolver implements ResourceLocationResolver {

    resolveResourceLocation(name: string): string {
        return `./${name}`;
    }

}

class RelativeResourceLocationResolver implements ResourceLocationResolver {

    constructor(private readonly pathPrefix: string) {}

    resolveResourceLocation(name: string): string {
        return `${this.pathPrefix}${name}`;
    }

}