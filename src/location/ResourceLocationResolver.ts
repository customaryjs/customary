export interface ResourceLocationResolver {
    resolveResourceLocation(name: string): Promise<string>;
}