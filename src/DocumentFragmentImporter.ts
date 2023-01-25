export class DocumentFragmentImporter {

    constructor(
        private readonly input: RequestInfo | URL) {
    }

    async getDocumentFragment(): Promise<DocumentFragment> {
        console.log('fetch: ' + this.input);
        const response: Response = await fetch(this.input);
        const text: string = await response.text();

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