export interface EnvSettingOverride {
	env: string; // The environment variable name
	settingKey: string; // Internal settings key (from backend SettingVariable tags)
	description: string; // What it controls
	requires?: string; // Conditions (e.g. requires AGENT_MODE or UI_CONFIGURATION_DISABLE)
	sensitive?: boolean; // Marks secrets so UI can treat differently
	deprecated?: boolean; // In case of legacy names
	note?: string; // Extra clarification
}
