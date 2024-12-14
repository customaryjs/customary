import {CustomaryDefinition} from "#customary/CustomaryDefinition.js";

export class CustomaryConstruct<T extends HTMLElement> {

    construct(element: T, customaryDefinition: CustomaryDefinition<T>){
        const {config, documentFragment, hooks} = customaryDefinition;

        this.useDocumentFragment(
            element,
            documentFragment.cloneNode(true) as DocumentFragment,
            {
                onConstruct: hooks?.construct?.onConstruct,
                replaceChildrenDont: config?.construct?.replaceChildrenDont
            });
    }

    private useDocumentFragment(
        element: T,
        documentFragment: DocumentFragment,
        options: {
            onConstruct? : (element: T, documentFragment: DocumentFragment) => void;
            replaceChildrenDont?: boolean;
        }
    ) {
        options.onConstruct?.(element, documentFragment);

        if (!options.replaceChildrenDont) {
            const parent: ParentNode = element.shadowRoot ?? element;
            parent.replaceChildren(documentFragment);
        }
    }

}