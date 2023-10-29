export interface FetchText {
    fetchText(input: RequestInfo | URL): Promise<string>;
}

class FetchText_DOM implements FetchText {
    public async fetchText(input: RequestInfo | URL): Promise<string> {
        return await (await fetch(input)).text();
    }
}

export const FetchText_DOM_singleton = new FetchText_DOM();
