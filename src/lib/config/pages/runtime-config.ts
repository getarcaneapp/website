import type { EnvConfig } from '#lib/types/env-config.type.js';
import type { EnvSettingOverride } from '#lib/types/env-settings-override.type.js';
import staticConfig from '../../../../static/config.json' with { type: 'json' };

type RuntimeEnvConfig = {
	env: string;
	description?: string;
	defaultValue?: string;
	field?: string;
	deprecated?: boolean;
};

type RuntimeEnvSettingOverride = Partial<EnvSettingOverride> &
	Pick<EnvSettingOverride, 'env' | 'settingKey'>;

type RuntimeDocsConfig = {
	envConfig?: RuntimeEnvConfig[];
	settingEnvOverrides?: RuntimeEnvSettingOverride[];
};

const LOCAL_CONFIG = staticConfig as RuntimeDocsConfig;

function mapEnvConfig(config: RuntimeDocsConfig): EnvConfig[] {
	return (config.envConfig ?? []).map((item) => ({
		name: item.env,
		description: item.description ?? `Maps to the ${item.field ?? item.env} config field.`,
		defaultValue: item.defaultValue ?? '',
		deprecated: item.deprecated
	}));
}

function mapEnvSettingsOverrides(config: RuntimeDocsConfig): EnvSettingOverride[] {
	return (config.settingEnvOverrides ?? []).map((item) => ({
		env: item.env,
		settingKey: item.settingKey,
		description: item.description ?? '',
		requires: item.requires,
		defaultValue: item.defaultValue,
		sensitive: item.sensitive,
		deprecated: item.deprecated,
		note: item.note
	}));
}

export const envConfig = mapEnvConfig(LOCAL_CONFIG);

export const envSettingsOverrides = mapEnvSettingsOverrides(LOCAL_CONFIG);
