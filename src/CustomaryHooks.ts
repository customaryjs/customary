export type CustomaryHooks<T extends HTMLElement> = {
    attributes?: Record<
        string,
        (element: T, name: string, oldValue: string | null, newValue: string | null) => void
    >;
    externalLoader?: {
        import_meta?: ImportMeta;
    }
    events?:
        Array<{
            selector?: string;
            type?: string;
            listener: (element: T, event: Event) => void;
        }>
        |
        Record<
            string,
            (element: T, event: Event) => void
        >;
    lifecycle?: {
        firstUpdated?: (element: T, changedProperties: PropertyValues) => void;
        updated?: (element: T, changedProperties: PropertyValues) => void;
        connected?: (element: T) => void;
        disconnected?: (element: T) => void;
    }
    render?: {
        view?: (state?: State) => View;
    }
    slots?: {
        slotchange?: (element: T, event?: Event) => void;
    }
}

type PropertyValues = Map<PropertyKey, unknown>;

type State = any;
type View = any;
