import {CustomaryConfig} from "#customary/CustomaryConfig.js";

export type AttributesDefinition = {
    readonly attributes: string[];
}

export function detectAttributes(
    {config, template}: {
        config: CustomaryConfig | undefined,
        template: HTMLTemplateElement
    }
): AttributesDefinition {
    const fromConfig = config?.attributes ?? [];
    const fromTemplate =
        template.getAttribute('data-customary-attributes')?.
        split(',').map(s => s.trim()) ?? [];
    return {attributes: [...new Set([...fromConfig, ...fromTemplate])]};
}