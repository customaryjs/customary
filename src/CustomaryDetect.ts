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

	private detectOptions(name: string): CustomaryOptions<any> {
		const optionsFromGlobalScope = this.globalThis[`customary:${name}`];
		const options: CustomaryOptions<any> = {
			config: {...optionsFromGlobalScope?.config, name},
			hooks: optionsFromGlobalScope?.hooks,
			state: (optionsFromGlobalScope?.state ?? this.detectState(name))
		};
		return options;
	}

	private detectState(name: string): object | object[] | undefined {
		const element = this.document.querySelector(
				`script[type="application/json"][data-customary-name='${name}']`
		);
		return element?.textContent ? JSON.parse(element.textContent) : undefined;
	}
}