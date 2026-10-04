import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, type Browser, type BrowserContext, type Locator, type Page } from 'playwright';

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(site, 'src/assets/screenshots');
const image = process.env.ARCANE_IMAGE ?? 'ghcr.io/getarcaneapp/manager:latest';
const port = Number(process.env.ARCANE_PORT ?? 13552);
const base = `http://localhost:${port}`;
const container = 'arcane-docs-screenshots';
const volume = 'arcane-docs-screenshots-data';
const buildsVolume = 'arcane-docs-screenshots-builds';
const apiKey = 'arc_docsscreenshots0000000000000000000000000000';
const password = 'Docs-screenshots-2026!';
const themes = ['light', 'dark'] as const;
const viewport = { width: 1440, height: 900 };
const only = process.argv.slice(2);

const demoProject = {
	name: 'demo',
	composeContent: `services:
  web:
    image: nginx:alpine
    container_name: demo-web
    ports:
      - '18080:80'
    volumes:
      - demo-html:/usr/share/nginx/html
    depends_on:
      - cache
    restart: unless-stopped

  cache:
    image: valkey/valkey:alpine
    container_name: demo-cache
    volumes:
      - demo-cache:/data
    restart: unless-stopped

  worker:
    image: alpine:3.20
    container_name: demo-worker
    command:
      - sh
      - -c
      - |
        printf '<!doctype html>\\n<html>\\n<head><title>Demo</title></head>\\n<body>\\n  <h1>Hello from Arcane</h1>\\n</body>\\n</html>\\n' > /site/index.html
        while true; do
          echo "$(date -Iseconds) worker: processed job $((RANDOM % 900 + 100)) in $((RANDOM % 400 + 20))ms"
          sleep 3
        done
    volumes:
      - demo-html:/site
    restart: unless-stopped

volumes:
  demo-html:
  demo-cache:
`
};

function docker(...args: string[]) {
	return execFileSync('docker', args, {
		encoding: 'utf8',
		stdio: ['ignore', 'pipe', 'pipe']
	}).trim();
}

async function start() {
	try {
		docker('rm', '-f', container);
	} catch {}
	docker('volume', 'create', buildsVolume);
	docker(
		'run',
		'--rm',
		'-v',
		`${buildsVolume}:/builds`,
		'alpine:3.20',
		'sh',
		'-c',
		'echo "FROM alpine:3.20" > /builds/Dockerfile && chown -R 65532:65532 /builds'
	);
	const env = {
		APP_URL: base,
		ENCRYPTION_KEY: 'docs-screenshots-encryption-key!',
		ADMIN_STATIC_API_KEY: apiKey,
		ANALYTICS_DISABLED: 'true',
		UPDATE_CHECK_DISABLED: 'true'
	};
	docker(
		'run',
		'-d',
		'--name',
		container,
		'-p',
		`${port}:3552`,
		'--cgroupns',
		'host',
		'-v',
		'/var/run/docker.sock:/var/run/docker.sock',
		'-v',
		`${volume}:/app/data`,
		'-v',
		`${buildsVolume}:/builds`,
		...Object.entries(env).flatMap(([k, v]) => ['-e', `${k}=${v}`]),
		image
	);
	for (let i = 0; i < 240; i++) {
		try {
			if ((await fetch(`${base}/api/health`)).ok) return;
		} catch {}
		await new Promise((r) => setTimeout(r, 500));
	}
	throw new Error(`Arcane did not become healthy:\n${docker('logs', '--tail', '40', container)}`);
}

function stop() {
	try {
		docker('rm', '-f', container);
	} catch {}
	for (const name of ['demo-web', 'demo-cache', 'demo-worker']) {
		try {
			docker('rm', '-f', name);
		} catch {}
	}
	for (const name of [volume, buildsVolume, 'demo_demo-html', 'demo_demo-cache']) {
		try {
			docker('volume', 'rm', '-f', name);
		} catch {}
	}
}

type ApiOptions = { form?: FormData; token?: string };

async function api(
	method: string,
	route: string,
	body?: unknown,
	{ form, token }: ApiOptions = {}
) {
	const headers: Record<string, string> = token
		? { Authorization: `Bearer ${token}` }
		: { 'X-Api-Key': apiKey };
	if (!form) headers['Content-Type'] = 'application/json';
	const payload = form ?? (body === undefined ? undefined : JSON.stringify(body));
	const res = await fetch(`${base}/api${route}`, {
		method,
		headers,
		...(payload === undefined ? {} : { body: payload })
	});
	if (!res.ok) throw new Error(`${method} ${route}: ${res.status} ${await res.text()}`);
	if (res.status === 204) return undefined;
	const text = await res.text();
	try {
		return JSON.parse(text);
	} catch {
		return text;
	}
}

const data = (res: any) => res?.data ?? res;

async function seed(): Promise<Seeded> {
	const login = await api('POST', '/auth/login', { username: 'arcane', password: 'arcane-admin' });
	const token = data(login).token;
	await api(
		'POST',
		'/auth/password',
		{ currentPassword: 'arcane-admin', newPassword: password },
		{ token }
	);

	const form = new FormData();
	form.append('project', JSON.stringify(demoProject));
	form.append('manifest', JSON.stringify({ fileChanges: [] }));
	const created = data(await api('POST', '/environments/0/projects', undefined, { form }));
	const projectId = created.id ?? created.projectId ?? created.name;
	await api('POST', `/environments/0/projects/${projectId}/up`, {});

	let worker: { id: string } | undefined;
	for (let i = 0; i < 60 && !worker; i++) {
		const containers = data(
			await api('GET', '/environments/0/containers?search=demo-worker&limit=50')
		);
		const list = containers.items ?? containers.data ?? containers;
		worker = Array.isArray(list)
			? list.find((c: any) =>
					(c.names ?? [c.name]).some((n: unknown) => String(n).includes('demo-worker'))
				)
			: undefined;
		if (!worker) await new Promise((r) => setTimeout(r, 1000));
	}
	if (!worker) throw new Error('The demo worker container did not start');
	return { projectId, workerId: worker.id };
}

const userAgent =
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';

async function context(
	browser: Browser,
	theme: 'light' | 'dark',
	storageState?: Awaited<ReturnType<BrowserContext['storageState']>>
) {
	const ctx = await browser.newContext({
		viewport,
		deviceScaleFactor: 2,
		colorScheme: theme,
		reducedMotion: 'reduce',
		storageState,
		userAgent
	});
	await ctx.addInitScript((mode: string) => localStorage.setItem('mode-watcher-mode', mode), theme);
	return ctx;
}

async function settle(page: Page) {
	await page.waitForLoadState('load');
	await page.evaluate(() => document.fonts.ready);
	await page.waitForTimeout(800);
}

async function tidy(page: Page) {
	await page.evaluate(() => {
		if (!document.getElementById('docs-capture')) {
			const style = document.createElement('style');
			style.id = 'docs-capture';
			style.textContent = [
				'[data-sonner-toaster], [data-slot="tooltip-content"] { display: none !important; }',
				'[data-slot="dialog-overlay"] { backdrop-filter: none !important; }'
			].join('\n');
			document.head.append(style);
		}
		if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
	});
	await page.mouse.move(0, 0);
}

function wanted(name: string) {
	return only.length === 0 || only.includes(name);
}

async function shoot(page: Page, name: string, theme: string, target?: Locator) {
	await tidy(page);
	if (!target) {
		const file = path.join(outDir, `${name}-${theme}.jpg`);
		await page.screenshot({ path: file, type: 'jpeg', quality: 88 });
		console.log(`screenshots: ${path.relative(site, file)}`);
		return;
	}
	const file = path.join(outDir, `${name}-${theme}.png`);
	const scroll = await page.evaluate(() => ({ x: window.scrollX, y: window.scrollY }));
	const box = await target.boundingBox();
	if (!box) throw new Error(`${name}: capture target is not visible`);
	const pad = 24;
	const clip = {
		x: Math.max(box.x + scroll.x - pad, 0),
		y: Math.max(box.y + scroll.y - pad, 0),
		width: box.width + pad * 2,
		height: box.height + pad * 2
	};
	await page.screenshot({ path: file, clip, fullPage: true });
	console.log(`screenshots: ${path.relative(site, file)}`);
}

async function attempt(name: string, fn: () => Promise<void>) {
	try {
		await fn();
	} catch (error) {
		console.error(`screenshots: ${name} failed: ${error instanceof Error ? error.message : error}`);
		process.exitCode = 1;
	}
}

type Seeded = { projectId: string; workerId: string };
type Step = [name: string, run: () => Promise<void>];

function steps(page: Page, theme: 'light' | 'dark', { projectId, workerId }: Seeded): Step[] {
	const go = async (route: string) => {
		await page.goto(`${base}${route}`);
		await settle(page);
	};
	const full = (name: string, route: string, after?: () => Promise<void>) =>
		[
			name,
			async () => {
				await go(route);
				await after?.();
				await shoot(page, name, theme);
			}
		] as Step;
	const dialog = (name: string, route: string, open: () => Promise<void>) =>
		[
			name,
			async () => {
				await go(route);
				await open();
				const target = page.getByRole('dialog');
				await target.waitFor();
				await shoot(page, name, theme, target);
				await page.keyboard.press('Escape');
			}
		] as Step;

	return [
		full('dashboard', '/dashboard'),
		full('containers-page', '/containers'),
		full('container-logs', `/containers/${workerId}`, async () => {
			await page.getByRole('tab', { name: 'Logs' }).click();
			await page.waitForTimeout(2500);
		}),
		full('images-page', '/images'),
		full('projects-page', '/projects'),
		full('project-workspace', `/projects/${projectId}?tab=compose`),
		full('volumes-page', '/volumes'),
		full('volume-workspace', '/volumes/demo_demo-html?tab=workspace', async () => {
			await page.getByText('index.html', { exact: true }).first().click();
			await page.waitForTimeout(1500);
		}),
		full('networks-page', '/networks'),
		full('network-ports', '/networks/ports'),
		full('network-topology', '/networks/topology', () => page.waitForTimeout(2000)),
		full('event-log-page', '/events'),
		full('activity-center', '/settings/activity'),
		full('templates-registry-page', '/customize/templates', () => page.waitForTimeout(2000)),
		dialog('environments-page', '/environments', () =>
			page.getByRole('button', { name: 'Add Environment', exact: true }).click()
		),
		dialog('backup-schedule', '/settings/backups', async () => {
			await page.getByRole('button', { name: 'Create', exact: true }).first().click();
			await page.getByRole('menuitem', { name: 'Schedule' }).click();
		}),
		full('swarm-setup', '/swarm/cluster'),
		full('locale-switcher', '/account', async () => {
			await page.getByRole('tab', { name: 'Preferences' }).click();
			const picker = page.locator('#accountLocalePicker');
			await picker.scrollIntoViewIfNeeded();
			await picker.click();
			await page.getByRole('option').first().waitFor();
		}),
		full('image-builds', '/images/builds', async () => {
			await page.getByRole('button', { name: 'Workspace', exact: true }).first().click();
			await page.locator('#image-tags').fill('docs/demo:latest');
			await page.getByRole('button', { name: 'Build', exact: true }).first().click();
			await page.getByText('Build completed').first().waitFor({ timeout: 180_000 });
		}),
		full('vulnerabilities', '/security?tab=vulnerabilities', async () => {
			await page.getByRole('button', { name: 'Scan all images', exact: true }).first().click();
			for (let i = 0; i < 300; i++) {
				const summary = data(await api('GET', '/environments/0/vulnerabilities/summary'));
				if (summary.scannedImages >= summary.totalImages && summary.summary?.total > 0) break;
				await page.waitForTimeout(1000);
			}
			await page.reload();
			await settle(page);
			await page.getByRole('row').filter({ hasText: /CVE-/ }).first().waitFor();
		})
	];
}

async function main() {
	fs.mkdirSync(outDir, { recursive: true });
	if (only.length === 0)
		for (const file of fs.readdirSync(outDir)) fs.rmSync(path.join(outDir, file));
	stop();
	await start();
	const browser = await chromium.launch({ args: ['--disable-gpu'] });

	try {
		const ids = await seed();

		const login = await context(browser, 'light');
		const page = await login.newPage();
		await page.goto(`${base}/login`);
		await page.getByLabel('Username').fill('arcane');
		await page.getByLabel('Password').fill(password);
		await page.getByRole('button', { name: 'Sign in to Arcane', exact: true }).click();
		await page.waitForURL(/\/dashboard/);
		const session = await login.storageState();
		await login.close();

		for (const theme of themes) {
			const ctx = await context(browser, theme, session);
			const p = await ctx.newPage();
			for (const [name, run] of steps(p, theme, ids)) {
				if (wanted(name)) await attempt(`${name} (${theme})`, run);
			}
			await ctx.close();
		}
	} finally {
		await browser.close();
		if (!process.env.KEEP) stop();
	}
}

await main();
