import {
    CustomaryAttributeOptions,
    CustomaryConstructOptions,
    CustomaryEvent,
    CustomarySlotOptions
} from "customary/CustomaryTypes.js";

export type CustomaryDefinition = {
    documentFragment: DocumentFragment;
    cssStyleSheet: CSSStyleSheet | undefined;
    constructOptions: CustomaryConstructOptions<any> | undefined;
    slotOptions: CustomarySlotOptions<any> | undefined;
    attributeOptions: CustomaryAttributeOptions<any> | undefined;
    events: CustomaryEvent[] | undefined,
    state: object | object[] | undefined;
}
