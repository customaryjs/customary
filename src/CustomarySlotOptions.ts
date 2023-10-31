export type CustomarySlotOptions<T extends HTMLElement> = {
    slotchange: Customary_slotchange<T>;
}

type Customary_slotchange<T extends HTMLElement> = (element: T, event?: Event) => void;