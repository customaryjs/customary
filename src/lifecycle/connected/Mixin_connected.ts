import {getDefinition} from "#customary/CustomaryDefinition.js";

export function execute_hook_connected(element: HTMLElement) {
    const definition = getDefinition(element);

    definition.declaration.hooks?.lifecycle?.connected?.(element);
}
