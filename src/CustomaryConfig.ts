export type CustomaryConfig = {
	construct?: {
		adoptStylesheetDont?: boolean;
		replaceChildrenDont?: boolean;
	};
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
}

export type CustomaryPreset = 'recommended';