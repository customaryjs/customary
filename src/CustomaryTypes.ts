export type CustomaryEvent<T extends HTMLElement> = {
    selector: string;
    type?: string;
    listener: (element: T, event: Event) => void;
}
