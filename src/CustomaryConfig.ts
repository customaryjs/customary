export type CustomaryConfig = {
	attributes?: string[];
	define?: {
		extends?: string;
		detileDont?: boolean;
		fontLocation?: string;
		fontLocations?: string[];
		resourceLocationResolution?: {
			kind: 'flat';
		} | {
			kind: 'relative';
			pathPrefix: string;
		};
	};
	preset?: CustomaryPreset;
	state?: string[];
}

export type CustomaryPreset = 'recommended';