import 'knockout';
import {ObservableArray} from "knockout";

export class KnockoutBridge {
    private readonly ko = globalThis.ko;

    applyBindings(bindingContext: any, rootNode: Node): void {
        if (rootNode instanceof Element && rootNode.shadowRoot) {
            return this.applyBindings(bindingContext, rootNode.shadowRoot);
        }
        if (rootNode instanceof DocumentFragment) {
            return rootNode.childNodes.forEach((node: Node) => {
                if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.COMMENT_NODE) {
                    this.ko.applyBindings(bindingContext, node);
                }
            });
        }
        this.ko.applyBindings(bindingContext, rootNode);
    }

    injectStateBindings(node: Node) {
        switch (node.nodeType) {
            case Node.DOCUMENT_FRAGMENT_NODE:
            {
                node.childNodes.forEach(node => {
                    this.injectStateBindings(node);
                });
                break;
            }
            case Node.ELEMENT_NODE:
            {
                if (node instanceof Element) {
                    const htmlString_old = node.innerHTML;
                    const htmlString_new = this.replaceStateBindings(htmlString_old);
                    if (htmlString_new !== htmlString_old)
                    node.innerHTML = htmlString_new;
                }
                break;
            }
        }
    }

    observableArray<T = any>(initialValue: T[]): ObservableArray<T> {
        return this.ko.observableArray(initialValue);
    }

    private replaceStateBindings(htmlString: string) {
        return htmlString.replace(/\{this\.state\.(\w+)}/g, '<span data-bind="text: $1"></span>');
    }
}
