import {PropertyValues} from "#customary/lifecycle/changedProperties/PropertyValues";
import {CustomaryHooks} from "#customary/CustomaryHooks";

export class CustomaryChanges_firstUpdated {
	constructor(
		element: HTMLElement,
		hooks: CustomaryHooks<any> | undefined
	) {
		this.element = element;
		this.hooks = hooks;
	}
	private readonly element: HTMLElement;
	private readonly hooks: CustomaryHooks<any> | undefined;

	execute_hooks_changes_firstUpdated(
		changedProperties: PropertyValues
	) {
		const changes = this.hooks?.changes;
		if (!(changes instanceof Array)) return;
		for (const change of changes) {
			const {name, firstUpdated} = change;
			if (firstUpdated && changedProperties.has(name)) {
				firstUpdated(
					this.element,
					(this.element as any)[name],
					changedProperties.get(name)
				);
			}
		}
	}
}