export class CustomaryState {
	constructor(element: HTMLElement) {
		this.element = element;
	}
	private readonly element: HTMLElement;

	create_or_modify_state_property(state_or_fn: State) {
		_setState(
			state_or_fn,
			() => (this.element as any).state,
			state => (this.element as any).state = state
		);
	}
}

function _setState(state_or_fn: State, getStateFn: GetStateFn, setStateFn: SetStateFn) {
	if (state_or_fn === null || state_or_fn === undefined) return;

	const _state = getStateFn();

	const state = state_or_fn instanceof Function
			? state_or_fn(_state)
			: state_or_fn;

	setStateFn(typeof _state === 'object' ? {..._state, ...state} : state);
}

type State = any;
type GetStateFn = () => State;
type SetStateFn = (state: State) => State;
