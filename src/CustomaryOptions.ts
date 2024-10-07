import {
    CustomaryAttributeOptions,
    CustomaryConstructOptions,
    CustomaryEvent,
    CustomarySlotOptions
} from "customary/CustomaryTypes.js";

export type CustomaryPreset = 'recommended';

export type CustomaryOptions<T extends HTMLElement> = {
    name: string;
    preset?: CustomaryPreset;
    events?: CustomaryEvent[];
    state?: object;
    fromHtml?: () => Promise<string>;
    defineOptions?: {
        extends?: string;
        detileDont?: boolean;
        fontLocation?: string;
        fontLocations?: string[];
        onTile?: (tile: string) => Promise<any>;
        resourceLocationResolution?: {
            kind: 'flat';
        } | {
            kind: 'relative';
            pathPrefix: string;
        };
    };
    constructOptions?: CustomaryConstructOptions<T>;
    attributeOptions?: CustomaryAttributeOptions<T>;
    slotOptions?: CustomarySlotOptions<T>;
    externalLoaderOptions?: {
        import_meta?: ImportMeta;
    }
}
