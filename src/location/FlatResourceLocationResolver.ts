// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {ResourceLocationResolver} from "customary/location/ResourceLocationResolver.js";

export class FlatResourceLocationResolver implements ResourceLocationResolver {

    async resolveResourceLocation(name: string): Promise<string> {
        return `./${name}`;
    }

}