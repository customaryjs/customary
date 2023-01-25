export interface CSSStyleSheetFactory {
    getCSSStyleSheet(location: string): Promise<CSSStyleSheet>;
}