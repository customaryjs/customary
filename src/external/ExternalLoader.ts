import {FetchText} from "#customary/fetch/FetchText.js";

export class ExternalLoader {
    constructor(
        private readonly fetchText: FetchText,
        private readonly options: {
            name: string,
            import_meta: ImportMeta;
        }
    ) {}

    async loadHtml(): Promise<string>
    {
        const location = this.resolveResourceLocation('html');
        return await this.fetchText.fetchText(location);
    }

    private resolveResourceLocation(extension: string): string
    {
        return resolveLocation({
            import_meta: this.options.import_meta,
            name: this.options.name,
            extension,
        })
    }
}

export function resolveLocation(
    options: {
        import_meta: ImportMeta;
        name: string,
        extension: string,
    }
): string
{
    return options.import_meta.resolve(`./${options.name}.${options.extension}`);
}
