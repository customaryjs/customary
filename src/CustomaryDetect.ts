import {CustomaryDeclaration} from "#customary/CustomaryOptions";

export class CustomaryDetect {
	constructor(
			private readonly document: Document,
			private readonly globalThis: any
	) {}

	detect(): CustomaryDeclaration<any>[] {
		return this.detectElementNames().map(name => this.detectDeclaration(name));
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

	private detectDeclaration(name: string): CustomaryDeclaration<any> {
		const fromGlobalScope: Partial<CustomaryDeclaration<any>> = this.globalThis[`customary:${name}`];

		const config = fromGlobalScope?.config;
		const hooks = fromGlobalScope?.hooks;
		const values = fromGlobalScope?.values ?? this.detectValues(name);

		return {
			name,
			...(config ? {config} : {}),
			...(hooks ? {hooks} : {}),
			...(values ? {values} : {}),
		};
	}

	private detectValues(name: string): Record<string, object | object[]> | undefined {
		const elements = this.document.querySelectorAll(
				`script[type="application/json"][data-customary-name='${name}']`
		);
		if (elements.length === 0) {
			return undefined;
		}
		const result: Record<string, object | object[]> = {};
		for (const element of elements) {
			if (element.textContent) {
				// TODO Require a key and retire default 'state'
				const key = element.getAttribute('data-customary-value') ?? 'state';
				result[key] = JSON.parse(element.textContent);
			}
		}
		return result;
	}
}
