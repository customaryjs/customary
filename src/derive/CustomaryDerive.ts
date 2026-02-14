import {CustomaryHooks} from "#customary/CustomaryHooks";

export class CustomaryDerive {
	constructor(
		element: HTMLElement,
		hooks: CustomaryHooks<any> | undefined
	) {
		this.element = element;
		this.hooks = hooks;
	}
	private readonly element: HTMLElement;
	private readonly hooks: CustomaryHooks<any> | undefined;

	execute_hooks_derive() {
		const derive = this.hooks?.derive;
		if (!derive) return;

		const deriveArray = derive instanceof Array ?
			derive
			: Object.entries(derive).map(
				([name, willUpdate]) =>
					({name, willUpdate})
			);

		for (const {name, willUpdate} of deriveArray) {
			(this.element as any)[name] = willUpdate(this.element);
		}
	}
}
