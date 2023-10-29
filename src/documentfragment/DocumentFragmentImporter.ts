// @ts-ignore JetBrains IntelliJ IDEA can Find Usages across dependencies, but must ts-ignore "'rootDir' is expected to contain all source files"
import {FetchText, FetchText_DOM_singleton} from "customary/fetch/FetchText.js";

export class DocumentFragmentImporter {

    constructor(private readonly fetchText: FetchText = FetchText_DOM_singleton) {}

    async getDocumentFragment(input: RequestInfo | URL): Promise<DocumentFragment> {
        console.log('fetch: ' + input);
        const text: string = await this.fetchText.fetchText(input);
        const innerHtml: string = this.extract_custom_element_body(text);

        const templateElement: HTMLTemplateElement = document.createElement('template');
        templateElement.innerHTML = innerHtml;
        return templateElement.content;
    }

    private extract_custom_element_body(text: string): string
    {
        return text.split('<!-- CUSTOM ELEMENT BEGIN -->')[1]
                ?.split('<!-- CUSTOM ELEMENT END -->')[0]
            ?? text;
    }
}