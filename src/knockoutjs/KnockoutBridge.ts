import 'knockout';
import {Observable, ObservableArray} from "knockout";

export class KnockoutBridge {
    private static readonly ko = globalThis.ko;

    static applyBindings(bindingContext: any, rootNode: Node): void {
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

    static injectStateBindings(node: Node) {
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

    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    static observable<T = any>(value: T): Observable<T> {
        return this.ko.observable(value);
    }

    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    static observableArray<T = any>(initialValue: T[]): ObservableArray<T> {
        return this.ko.observableArray(initialValue);
    }

    static merge(bindingContext: any, values: object | Array<any>) {
        if (values instanceof Array) return this.mergeArray(bindingContext ?? this.ko.observableArray([]), values);
        return this.mergeObject(bindingContext, values);
    }

    static snapshot(bindingContext: any): object | Array<any> {
        if ('indexOf' in bindingContext) return this.snapshotArray(bindingContext);
        return this.snapshotObject(bindingContext);
    }

    private static snapshotArray(bindingContext: ObservableArray): Array<any> {
        return bindingContext();
    }

    private static snapshotObject(bindingContext: object): object {
        const record: Record<string, any> = {};
        for (const [k, v] of Object.entries(bindingContext)) {
            record[k] = (v as Observable)();
        }
        return record;
    }

    private static mergeArray(bindingContext: any, values: Array<any>) {
        if (!bindingContext) return this.ko.observableArray(values);
        (bindingContext as ObservableArray)(values);
        return bindingContext;
    }

    private static mergeObject(bindingContext: any, values: object) {
        if (!bindingContext) {
            const record: Record<string, any> = {};
            for (const [k, v] of Object.entries(values)) {
                record[k] = this.ko.observable(v);
            }
            return record;
        }
        for (const [k, v] of Object.entries(values)) {
            if (k in bindingContext) {
                (bindingContext[k] as Observable)(v);
            } else {
                bindingContext[k] = this.ko.observable(v);
            }
        }
        return bindingContext;
    }

    private static replaceStateBindings(htmlString: string) {
        return htmlString.replace(/\{this\.state\.(\w+)}/g, '<span data-bind="text: $1"></span>');
    }
}
