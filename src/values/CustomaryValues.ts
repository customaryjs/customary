import {CustomaryDefinition} from "#customary/CustomaryDefinition.js";

export class CustomaryValues {
    constructor(element: HTMLElement) {
        this.element = element;
    }

    private readonly element: HTMLElement;

    install_values(
         definition: CustomaryDefinition<any>
    ) {
        if (definition.declaration.values) {
            Object.assign(this.element, definition.declaration.values);
        }
    }
}