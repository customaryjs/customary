export class CustomaryTestingQueries {

    static findByTextContent(container: ParentNode, expected: string, {selector}:{selector: string}) {
        const elements= querySelectorAll(container, selector);
        for (const element of elements) {
            const textContentArray: string[] = collectAllTextContent(element);
            const textContent = textContentArray
                .map(s => {const t = s.trim(); return t.length ? t : s})
                .join('')
                .trim();
            if (textContent === expected) return element;
        }
        throw new Error(`No element matching ${selector} has textContent ${expected}`);
    }

    static findByClass(container: ParentNode, expected: string, {selector}:{selector: string}) {
        const elements = querySelectorAll(container, selector);
        for (const element of elements) {
            if (element.classList.contains(expected)) {
                return element;
            }
        }
        throw new Error(`No element matching ${selector} has class ${expected}`);
    }

}

function querySelectorAll(container: ParentNode, selector: string) {
    const elements = container.querySelectorAll(selector);
    if (elements.length === 0) throw new Error(`No element matches selector '${selector}'`);
    return elements;
}

function collectAllTextContent(node: Node): string[] {
    if (node.nodeType === Node.COMMENT_NODE) return [];
    if ((node as Element).tagName === 'SCRIPT') return [];
    if ((node as Element).shadowRoot) return collectAllTextContent((node as Element).shadowRoot!);
    const textContent = node.textContent?.replace(/\s+/g, ' ');
    if (textContent?.trim?.().length) return [textContent];
    if (node.hasChildNodes()) return Array.from(node.childNodes).flatMap(child => collectAllTextContent(child));
    if (textContent === ' ') return [textContent];
    return [];
}
