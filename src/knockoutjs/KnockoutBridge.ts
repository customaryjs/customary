// https://github.com/parcel-bundler/parcel/issues/4148#issuecomment-1441326386
const knockout_dynamic_import = 'knockout';

interface Observable<T = any> {
    (): T;
    (value: T): any;
}

interface ObservableArray<T = any> extends Observable<T[]> {
    (value: T[] | null | undefined): this;
}

export class KnockoutBridgeFactory {
    async createKnockoutBridge() {
        await import(knockout_dynamic_import);
        return new KnockoutBridge((globalThis as any).ko);
    }
}

export class KnockoutBridge {
    constructor(private readonly ko: any) {}

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

    // used by customary-tutorials > knockout
    observable<T = any>(value: T): Observable<T> {
        return this.ko.observable(value);
    }

    // used by customary-tutorials > knockout
    observableArray<T = any>(initialValue: T[]): ObservableArray<T> {
        return this.ko.observableArray(initialValue);
    }

    merge(bindingContext: any, values: object | Array<any>) {
        if (values instanceof Array) return this.mergeArray(bindingContext, values);
        return this.mergeObject(bindingContext, values);
    }

    snapshot(bindingContext: any): object | Array<any> {
        if ('indexOf' in bindingContext) return this.snapshotArray(bindingContext);
        return this.snapshotObject(bindingContext);
    }

    private snapshotArray(bindingContext: ObservableArray): Array<any> {
        return bindingContext();
    }

    private snapshotObject(bindingContext: object): object {
        const record: Record<string, any> = {};
        for (const [k, v] of Object.entries(bindingContext)) {
            record[k] = (v as Observable)();
        }
        return record;
    }

    private mergeArray(bindingContext: any, values: Array<any>) {
        if (!bindingContext) return this.ko.observableArray(values);
        (bindingContext as ObservableArray)(values);
        return bindingContext;
    }

    private mergeObject(bindingContext: any, values: object) {
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
}
