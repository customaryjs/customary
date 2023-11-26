import {NotFound404Error} from "customary/fetch/NotFound404Error.js";

export interface FetchText {
    fetchText(input: RequestInfo | URL): Promise<string>;
}

class FetchText_DOM implements FetchText {
    public async fetchText(input: RequestInfo | URL): Promise<string> {
        console.log('fetch: ' + input);
        const response = await fetch(input);
        if (!response.ok) {
            if (response.status === 404)
                throw new NotFound404Error(response.statusText, {cause:response});
            else
                throw new Error(response.statusText, {cause:response});
        }
        return await response.text();
    }
}

export const FetchText_DOM_singleton = new FetchText_DOM();
