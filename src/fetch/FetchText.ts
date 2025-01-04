export interface FetchText {
    fetchText(input: RequestInfo | URL): Promise<string>;
}

class FetchText_DOM implements FetchText {
    public async fetchText(input: RequestInfo | URL): Promise<string> {
        console.debug('fetch: ' + input);
        const response = await fetch(input);
        if (response.ok) {
            return await response.text();
        }
        throw new Error(response.statusText, {cause: response});
    }
}

export const FetchText_DOM_singleton = new FetchText_DOM();
