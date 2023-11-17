// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {ResourceLocationResolver} from "customary/location/ResourceLocationResolver.js";

export class RelativeResourceLocationResolver implements ResourceLocationResolver {

    constructor(private readonly pathPrefix: string) {}

    async resolveResourceLocation(name: string): Promise<string> {
        return `${this.pathPrefix}${name}`;
    }

}