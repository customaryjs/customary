export function toSelector(markup: string): string {
    return markup.replace(':', '\\:');
}
