export type CustomaryPreset = 'recommended';

export type CustomaryOptions = {
    name: string;
    preset?: CustomaryPreset;
    state?: object;
    defineOptions?: {
        extends?: string;
        detileDont?: boolean;
        fontLocation?: string;
        fontLocations?: string[];
        resourceLocationResolution?: {
            kind: 'flat';
        } | {
            kind: 'relative';
            pathPrefix: string;
        };
    };
    constructOptions?: {
        adoptStylesheetDont?: boolean;
        attachShadowDont?: boolean;
        replaceChildrenDont?: boolean;
    };
    externalLoaderOptions?: {
        import_meta?: ImportMeta;
    }
}
