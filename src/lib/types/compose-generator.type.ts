export type FieldType = 'text' | 'password' | 'number' | 'checkbox' | 'select';

export interface GeneratorField {
	/** The key used in the config state object */
	key: string;
	/** Environment variable name (for output) */
	envName: string;
	/** Display label */
	label: string;
	/** Helper description */
	description?: string;
	/** Field input type */
	type: FieldType;
	/** Default value */
	defaultValue: string | boolean;
	/** Placeholder text */
	placeholder?: string;
	/** Whether this field can be auto-generated (for secrets) */
	canGenerate?: boolean;
	/** Options for select fields */
	options?: { label: string; value: string }[];
	/** Only show when parent toggle is enabled */
	dependsOn?: string;
	/** Whether to include in generated compose (false = internal use only) */
	includeInCompose?: boolean;
}

export interface GeneratorSection {
	/** Unique section ID */
	id: string;
	/** Display title */
	title: string;
	/** Section description */
	description: string;
	/** Icon name (lucide) */
	icon: string;
	/** Whether this section has a toggle to enable/disable */
	hasToggle?: boolean;
	/** The key for the toggle field */
	toggleKey?: string;
	/** Fields in this section */
	fields: GeneratorField[];
}

export interface GeneratorTab {
	/** Unique tab ID */
	id: string;
	/** Display label */
	label: string;
	/** Short label for mobile */
	shortLabel?: string;
	/** Icon name */
	icon: string;
	/** Sections within this tab */
	sections: GeneratorSection[];
}

export type GeneratorConfig = GeneratorTab[];
