export type CustomaryDefineOptions = {
    elementDefinitionOptions?: ElementDefinitionOptions;
    detileDont?: boolean;
    fontLocation?: string;
    fontLocations?: string[];
    onTile?: (tile: string) => Promise<any>;
    resourceLocationResolution?: ResourceLocationResolution;
}

type ResourceLocationResolution = FlatResourceLocationResolution | RelativeResourceLocationResolution;

type FlatResourceLocationResolution = {
    kind: 'flat';
}

type RelativeResourceLocationResolution = {
    kind: 'relative';
    pathPrefix: string;
}
