import {LitElement} from 'lit';
import {CustomaryLit} from "#customary/lit/CustomaryLit.js";

type Constructor<T = {}> = new (...args: any[]) => T;

export function Mixin_state
		<T extends Constructor<LitElement>>(superClass: T): T {
	class Mixin_state_Class extends superClass {
		constructor(...args: any[]) {
			super(args);

			Object.assign(this, CustomaryLit.getCustomaryDefinition(this)
					.declaration.state ?? {});
		}

		// noinspection JSUnusedGlobalSymbols
		setState(state_or_fn: any) {
			_setState(
					state_or_fn,
					() => (this as any).state,
					state => (this as any).state = state
			);
		}
	}
	return Mixin_state_Class;
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
