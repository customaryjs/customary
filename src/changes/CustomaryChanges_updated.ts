import {PropertyValues} from "#customary/lifecycle/changedProperties/PropertyValues.js";
import {CustomaryHooks} from "#customary/CustomaryHooks";

export class CustomaryChanges_updated {
	constructor(
		element: HTMLElement,
		hooks: CustomaryHooks<any> | undefined
	) {
		this.element = element;
		this.hooks = hooks;
	}
	private readonly element: HTMLElement;
	private readonly hooks: CustomaryHooks<any> | undefined;

	execute_hooks_changes_updated(
		changedProperties: PropertyValues
	) {
		const changes = this.hooks?.changes;
		if (!changes) return;

		const changesArray = changes instanceof Array ?
			changes
			: Object.entries(changes).map(
				([name, updated]) =>
					({name, updated})
			);

		for (const change of changesArray) {
			const {name, updated} = change;
			if (updated && changedProperties.has(name)) {
				updated(
					this.element,
					(this.element as any)[name],
					changedProperties.get(name)
				);
			}
		}
	}
}