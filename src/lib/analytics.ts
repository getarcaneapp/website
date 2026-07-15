type PlausibleProperty = string | number | boolean;

type AnalyticsEvents = {
	'Compose Generated': {
		access_method: 'direct_socket' | 'socket_proxy';
		database: 'postgresql' | 'sqlite';
		authentication: 'local' | 'oidc';
		project_storage: 'host_mount' | 'named_volume';
		selinux: 'disabled' | 'enabled';
	};
	'Compose Exported': {
		method: 'copy' | 'download';
	};
	'Docs Code Copied': {
		language: string;
	};
	'CTA Clicked': {
		cta: 'changelog' | 'demo' | 'get_started';
		placement: 'home_announcement' | 'home_hero';
	};
};

type Plausible = (
	eventName: string,
	options?: { props?: Record<string, PlausibleProperty> }
) => void;

/** Sends a privacy-safe custom event when the Plausible tracker is available. */
export function trackEvent<EventName extends keyof AnalyticsEvents>(
	eventName: EventName,
	props: AnalyticsEvents[EventName]
): void {
	if (typeof window === 'undefined') return;

	const plausible = (window as Window & { plausible?: Plausible }).plausible;
	plausible?.(eventName, { props });
}
