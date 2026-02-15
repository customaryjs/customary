import {LitElement} from "#customary/lit";
import {CustomaryDefinition} from "#customary/CustomaryDefinition.js";
import {AttributeProperties} from "#customary/attributes/AttributeProperties.js";
import {DeriveProperties} from "#customary/derive/DeriveProperties.js";
import {PropertiesProperties} from "#customary/properties/PropertiesProperties.js";
import {StateProperties} from "#customary/state/StateProperties.js";
import {ValuesProperties} from "#customary/values/ValuesProperties.js";

export class CustomaryProperties {
    static addProperties<T extends HTMLElement>(
        constructor: typeof LitElement,
        customaryDefinition: CustomaryDefinition<T>,
    )
    {
        AttributeProperties.addProperties(constructor, customaryDefinition.attributes);
        DeriveProperties.addProperties(constructor, customaryDefinition.declaration);
        StateProperties.addProperties(constructor, customaryDefinition.declaration);
        PropertiesProperties.addProperties(constructor, customaryDefinition.declaration);
        ValuesProperties.addProperties(constructor, customaryDefinition.declaration);
    }
}