export type FieldType = 'text' | 'password' | 'number' | 'checkbox' | 'select';

export type DeploymentTargetId =
	| 'docker'
	| 'podman-rootless'
	| 'podman-rootful'
	| 'podman-quadlet'
	| 'agent-edge'
	| 'agent-binary';

export type GeneratorValues = Record<string, string | boolean>;

export interface FieldContext {
	target: DeploymentTargetId;
	config: GeneratorValues;
}

export interface DeploymentTarget {
	id: DeploymentTargetId;
	label: string;
	description: string;
	resultDescription: string;
	docsHref: string;
	docsLabel: string;
}

export interface DeploymentGroup {
	id: string;
	title: string;
	description: string;
	targets: DeploymentTarget[];
}

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
	/** Whether the generated output uses a placeholder until this is filled in */
	required?: boolean;
	/** Whether to tuck this field into the section's advanced options */
	advanced?: boolean;
	/** Returns an error message when the value is invalid */
	validate?: (value: string) => string | undefined;
	/** Options for select fields */
	options?: { label: string; value: string }[];
	/** Only show when parent toggle is enabled */
	dependsOn?: string;
	/** Whether to include in the generated environment (false = internal use only) */
	includeInEnv?: boolean;
	targets?: DeploymentTargetId[];
	visibleWhen?: (context: FieldContext) => boolean;
}

export interface GeneratorSection {
	/** Unique section ID */
	id: string;
	/** Display title */
	title: string;
	/** Section description */
	description: string;
	/** Icon name (Iconify) */
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
	/** Icon name */
	icon: string;
	/** Sections within this tab */
	sections: GeneratorSection[];
	targets?: DeploymentTargetId[];
}

export type GeneratorConfig = GeneratorTab[];

export type OutputLanguage = 'yaml' | 'ini' | 'bash' | 'dotenv';

export interface GeneratedFile {
	id: string;
	title: string;
	description?: string;
	filename?: string;
	lang: OutputLanguage;
	code: string;
}
