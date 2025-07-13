import {UncompiledTemplateResult} from "lit-html";

/**
 * https://github.com/lit/lit/blob/43c6168acc4a30d70091ee30c307f692a02387d5/packages/lit-html/src/lit-html.ts#L688
 * https://github.com/lit/lit/blob/43c6168acc4a30d70091ee30c307f692a02387d5/packages/lit-html/src/test/lit-html_test.ts#L3200-L3218
 * https://github.com/lit/lit/pull/3987/files#diff-bead45bb43cda474d916704550a1b26322667aa42b814c48300b05be79b9a7ebR595
 * https://github.com/lit/lit/pull/2307/files#diff-91d82786d99da1716b8b2e02534f0e967e9b7f2f539acb7b712f6900094b6263
 */
const KEY =	'__customary__immutable_TemplateStringsArray_instances';

export function reuse_immutable_TemplateStringsArray(
    element: any,
    template: UncompiledTemplateResult
)
{
    const immutables: Array<TemplateStringsArray> | undefined = (<any>element)[KEY];

    if (!immutables) {
        (<any>element)[KEY] = [template.strings];
        return;
    }

    const existing: TemplateStringsArray | undefined = immutables.find(
        strings => areReadonlyArraysEqual(strings, template.strings)
    );

    if (!existing) {
        immutables.push(template.strings);
    }
    else {
        // reuse the original array instance, otherwise the template will rerender
        template.strings = existing;
    }
}

function areReadonlyArraysEqual<T>(a: ReadonlyArray<T>, b: ReadonlyArray<T>): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}
