type State = any;
type GetStateFn = () => State;
type SetStateFn = (state: State) => State;

export class CustomaryStateBroker {

	static setState(state_or_fn: State, getStateFn: GetStateFn, setStateFn: SetStateFn) {
		if (state_or_fn === null || state_or_fn === undefined) return;

		const _state = getStateFn();

		const state = state_or_fn instanceof Function
						? state_or_fn(_state)
						: state_or_fn;

		setStateFn(typeof _state === 'object' ? {..._state, ...state} : state);
	}

}
