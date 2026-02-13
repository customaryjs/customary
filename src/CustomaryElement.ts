import {LitElement} from "#customary/lit";
import {CustomaryBind} from "#customary/bind/CustomaryBind.js";
import {CustomaryChanges_firstUpdated} from "#customary/changes/CustomaryChanges_firstUpdated.js";
import {CustomaryChanges_updated} from "#customary/changes/CustomaryChanges_updated.js";
import {CustomaryChanges_willUpdate} from "#customary/changes/CustomaryChanges_willUpdate.js";
import {CustomaryDefinition, getDefinition} from "#customary/CustomaryDefinition.js";
import {CustomaryEvents} from "#customary/events/CustomaryEvents.js";
import {CustomaryHooks} from "#customary/CustomaryHooks.js";
import {CustomaryRender} from "#customary/render/CustomaryRender.js";
import {CustomarySlots} from "#customary/slots/CustomarySlots.js";
import {CustomaryState} from "#customary/state/CustomaryState.js";
import {CustomaryStylesheets} from "#customary/style/CustomaryStylesheets.js";
import {CustomaryValues} from "#customary/values/CustomaryValues.js";
import {PropertyValues} from "#customary/lifecycle/changedProperties/PropertyValues.js";

export class CustomaryElement extends LitElement {
	constructor() {
		try {
			super();
		}
		catch (error) {
			if (error instanceof TypeError) {
				if (error.message.startsWith("Illegal constructor")) {
					throw new Error(
							"Custom element must be fully defined before you can instantiate it. Try this:\n" +
							"    await Customary.untilDefined(MyCustomElement);\n" +
							"    const element = new MyCustomElement();",
							{cause: error}
					);
				}
			}
			throw error;
		}

		const definition = getDefinition(this);

		this._definition = definition;

		const hooks = definition.declaration.hooks;

		this.bind = new CustomaryBind(this);
		this.changes_firstUpdated = new CustomaryChanges_firstUpdated(this, hooks);
		this.changes_updated = new CustomaryChanges_updated(this, hooks);
		this.changes_willUpdate = new CustomaryChanges_willUpdate(this, hooks);
		this.events = new CustomaryEvents(this, hooks);
		this._render = new CustomaryRender(this);
		this.slots = new CustomarySlots(this, hooks);
		this.stylesheets = new CustomaryStylesheets(this);
		this.values = new CustomaryValues(this);

		this.hooks = hooks;
	}
	private readonly _definition: CustomaryDefinition<this>;
	private readonly changes_firstUpdated: CustomaryChanges_firstUpdated;
	private readonly bind: CustomaryBind;
	private readonly changes_updated: CustomaryChanges_updated;
	private readonly changes_willUpdate: CustomaryChanges_willUpdate;
	private readonly events: CustomaryEvents;
	private readonly hooks: CustomaryHooks<this> | undefined;
	private readonly _render: CustomaryRender;
	private readonly slots: CustomarySlots;
	private readonly stylesheets: CustomaryStylesheets;
	private readonly values: CustomaryValues;

	// noinspection JSUnusedGlobalSymbols
	setState(state_or_fn: any) {
		new CustomaryState(this)
			.create_or_modify_state_property(state_or_fn);
	}

	override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
		super.attributeChangedCallback(name, oldValue, newValue);

		this.hooks?.dom?.attributeChangedCallback?.(this, name, oldValue, newValue);
	}

	override createRenderRoot() {
		if (this._definition.declaration.config?.construct?.shadowRootDont) {
			return this;
		}

		return super.createRenderRoot();
	}

    override connectedCallback() {
        super.connectedCallback();

		this.stylesheets.link_external_css_and_link_fonts(this._definition);

		this.events.installEventListeners();

		this.bind.installEventListenersForBindings(this._definition.attributes.attributes);

		this.values.install_values(this._definition);

		this.hooks?.lifecycle?.connected?.(this);
    }

	override disconnectedCallback() {
		super.disconnectedCallback();

		this.hooks?.lifecycle?.disconnected?.(this);
	}

	protected override firstUpdated(changedProperties: PropertyValues) {
		super.firstUpdated(changedProperties);

		this.hooks?.lifecycle?.firstUpdated?.(this, changedProperties);

		this.changes_firstUpdated.execute_hooks_changes_firstUpdated(changedProperties);

		this.slots.install_slotchange();
	}

	protected override render(): unknown {
		return this._render.render_lit_html_TemplateResult(
			{htmlString: this._definition.immutable_htmlString,
			state: (this as any).state}
		);
	}

	protected override updated(changedProperties: PropertyValues) {
		super.updated(changedProperties);

		this.hooks?.lifecycle?.updated?.(this, changedProperties);

		this.changes_updated.execute_hooks_changes_updated(changedProperties);
	}

	protected override willUpdate(changedProperties: PropertyValues) {
		super.willUpdate(changedProperties);

		this.hooks?.lifecycle?.willUpdate?.(this, changedProperties);

		this.changes_willUpdate.execute_hooks_changes_willUpdate(changedProperties);
	}
}
