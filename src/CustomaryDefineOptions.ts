export interface CustomaryDefineOptions {
    elementDefinitionOptions?: ElementDefinitionOptions,
    fontLocations?: string[],
    resourceLocationResolution?: ResourceLocationResolution,
}

type ResourceLocationResolution = FlatResourceLocationResolution | RelativeResourceLocationResolution;

type FlatResourceLocationResolution = {
    kind: 'flat';
}

type RelativeResourceLocationResolution = {
    kind: 'relative';
    pathPrefix?: string;
}
