import {CustomaryOptions} from "#customary/CustomaryOptions";

export class CustomaryDetect {
	constructor(
			private readonly document: Document,
			private readonly globalThis: any
	) {}

	detect(): CustomaryOptions<any>[] {
		return this.detectElementNames().map(name => this.detectOptions(name));
	}

	private detectElementNames(): string[] {
		const attribute = 'data-customary-name';
		const fromDocument = [...this.document.querySelectorAll(`template[${attribute}]`)]
				.map(template => template.getAttribute(attribute)!);

		const prefix = 'customary:';
		const fromGlobalScope = Object.keys(this.globalThis)
				.filter(name => name.startsWith(prefix))
				.map(name => name.substring(prefix.length));

		return [...new Set([...fromDocument, ...fromGlobalScope])];
	}

	private detectOptions(name: string): CustomaryOptions<HTMLElement> {
		const optionsFromGlobalScope: CustomaryOptions<any> = this.globalThis[`customary:${name}`];

		const config = {...optionsFromGlobalScope?.config, name};
		const hooks = optionsFromGlobalScope?.hooks;
		const state = optionsFromGlobalScope?.state ?? this.detectState(name);

		return {
			config,
			...(hooks ? {hooks} : {}),
			...(state ? {state} : {}),
		};
	}

	private detectState(name: string): Record<string, object | object[]> | undefined {
		const elements = this.document.querySelectorAll(
				`script[type="application/json"][data-customary-name='${name}']`
		);
		if (elements.length === 0) {
			return undefined;
		}
		const result: Record<string, object | object[]> = {};
		for (const element of elements) {
			if (element.textContent) {
				const key = element.getAttribute('data-customary-state') ?? 'state';
				result[key] = JSON.parse(element.textContent);
			}
		}
		return result;
	}
}
