export type FieldType = 'text' | 'password' | 'number' | 'checkbox' | 'select';

export type DeploymentTargetId =
	| 'docker'
	| 'podman-rootless'
	| 'podman-rootful'
	| 'podman-quadlet'
	| 'agent-container'
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
	key: string;
	envName: string;
	label: string;
	description?: string;
	type: FieldType;
	defaultValue: string | boolean;
	envValue?: string;
	placeholder?: string;
	/** Secrets only. */
	canGenerate?: boolean;
	/** Output shows a placeholder until this is filled in. */
	required?: boolean;
	/** Shown under the section's advanced options. */
	advanced?: boolean;
	/** Returns an error message, or undefined when valid. */
	validate?: (value: string) => string | undefined;
	options?: { label: string; value: string }[];
	/** Hidden until this toggle key is enabled. */
	dependsOn?: string;
	/** false = internal only, left out of the generated env. */
	includeInEnv?: boolean;
	targets?: DeploymentTargetId[];
	visibleWhen?: (context: FieldContext) => boolean;
}

export interface GeneratorSection {
	id: string;
	title: string;
	description: string;
	icon: string;
	hasToggle?: boolean;
	toggleKey?: string;
	fields: GeneratorField[];
}

export interface GeneratorTab {
	id: string;
	label: string;
	icon: string;
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
