export function toSelector(namespaced_tag_name: string): string {
    return namespaced_tag_name.replace(':', '\\:');
}
