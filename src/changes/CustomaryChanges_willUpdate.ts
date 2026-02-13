import {PropertyValues} from "#customary/lifecycle/changedProperties/PropertyValues";
import {CustomaryHooks} from "#customary/CustomaryHooks";

export class CustomaryChanges_willUpdate {
	constructor(
		element: HTMLElement,
		hooks: CustomaryHooks<any> | undefined
	) {
		this.element = element;
		this.hooks = hooks;
	}
	private readonly element: HTMLElement;
	private readonly hooks: CustomaryHooks<any> | undefined;

	execute_hooks_changes_willUpdate(
		changedProperties: PropertyValues
	) {
		const changes = this.hooks?.changes;
		if (!(changes instanceof Array)) return;

		for (const change of changes) {
			const {name, willUpdate} = change;
			if (willUpdate && changedProperties.has(name)) {
				willUpdate(
					this.element,
					(this.element as any)[name],
					changedProperties.get(name)
				);
			}
		}
	}
}