export type CustomaryConfig = {
	attributes?: string[];
	construct?: {
		shadowRootDont?: boolean;
	}
	define?: {
		fontLocation?: string;
		fontLocations?: string[];
	};
	state?: string[];
}
