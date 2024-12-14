type State = any;
type View = any;

export type RenderHooks = {
	view?: (state?: State) => View;
}
