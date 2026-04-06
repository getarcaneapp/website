import { browser, dev } from '$app/environment';
import type { EnvConfig } from '$lib/types/env-config.type.js';
import type { EnvSettingOverride } from '$lib/types/env-settings-override.type.js';
import staticConfig from '../../../../static/config.json' with { type: 'json' };

type RuntimeEnvConfig = {
	env: string;
	description?: string;
	defaultValue?: string;
	field?: string;
};

type RuntimeEnvSettingOverride = Partial<EnvSettingOverride> &
	Pick<EnvSettingOverride, 'env' | 'settingKey'>;

type RuntimeDocsConfig = {
	envConfig?: RuntimeEnvConfig[];
	settingEnvOverrides?: RuntimeEnvSettingOverride[];
};

const RUNTIME_CONFIG_URLS = ['/config.json'];

const LOCAL_CONFIG = staticConfig as RuntimeDocsConfig;

async function loadRuntimeDocsConfig(): Promise<RuntimeDocsConfig | null> {
	if (!browser || dev) {
		return LOCAL_CONFIG;
	}

	for (const url of RUNTIME_CONFIG_URLS) {
		try {
			const response = await fetch(url);

			if (!response.ok) {
				continue;
			}

			return (await response.json()) as RuntimeDocsConfig;
		} catch {
			continue;
		}
	}

	return null;
}

function mapEnvConfig(config: RuntimeDocsConfig): EnvConfig[] {
	return (config.envConfig ?? []).map((item) => ({
		name: item.env,
		description: item.description ?? `Maps to the ${item.field ?? item.env} config field.`,
		defaultValue: item.defaultValue ?? ''
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

export async function getRuntimeEnvConfig(): Promise<EnvConfig[]> {
	const runtimeConfig = await loadRuntimeDocsConfig();

	if (!runtimeConfig?.envConfig?.length) {
		return envConfig;
	}

	return mapEnvConfig(runtimeConfig);
}

export async function getRuntimeEnvSettingsOverrides(): Promise<EnvSettingOverride[]> {
	const runtimeConfig = await loadRuntimeDocsConfig();

	if (!runtimeConfig?.settingEnvOverrides?.length) {
		return envSettingsOverrides;
	}

	return mapEnvSettingsOverrides(runtimeConfig);
}
