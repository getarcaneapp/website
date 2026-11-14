import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { type Browser, type BrowserContext, chromium, type Locator, type Page } from 'playwright';

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(site, 'src/assets/screenshots');
const image = process.env.ARCANE_IMAGE ?? 'ghcr.io/getarcaneapp/manager:latest';
const port = Number(process.env.ARCANE_PORT ?? 13552);
const base = `http://localhost:${port}`;
// Lives inside the dind daemon, so a plain name is safe and reads naturally in the shots.
const container = 'arcane';
const volume = 'arcane-docs-screenshots-data';
const buildsVolume = 'arcane-docs-screenshots-builds';
// Everything (Arcane included) runs inside a throwaway Docker-in-Docker daemon, so the shots
// show only the demo project and never the host's containers, images, networks or hostname.
// Arcane must run inside it too: it finds its own container to launch the Trivy scanner.
const dind = 'arcane-docs-screenshots-dind';
// Per-step limit so one stuck step can't hang the run; the scan step gets longer.
const stepTimeoutMs = 4 * 60_000;
const scanTimeoutMs = 12 * 60_000;
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
		stdio: ['ignore', 'pipe', 'pipe'],
		timeout: 10 * 60_000
	}).trim();
}

// Runs a docker command against the daemon inside the dind container.
function inner(...args: string[]) {
	return docker('exec', dind, 'docker', ...args);
}

async function startDind() {
	docker(
		'run',
		'-d',
		'--privileged',
		// Pin runc: `docker exec` into a privileged container fails under youki as the host default.
		'--runtime',
		'runc',
		'--name',
		dind,
		'-p',
		`${port}:${port}`,
		'-e',
		'DOCKER_TLS_CERTDIR=',
		'docker:dind'
	);
	for (let i = 0; i < 120; i++) {
		try {
			docker('exec', dind, 'docker', 'info');
			return;
		} catch {}
		await new Promise((r) => setTimeout(r, 500));
	}
	throw new Error(`Docker-in-Docker did not start:\n${docker('logs', '--tail', '40', dind)}`);
}

async function start() {
	await startDind();
	inner('volume', 'create', buildsVolume);
	inner(
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
		ARCANE_APP_URL: base,
		ARCANE_ENCRYPTION_KEY: 'docs-screenshots-encryption-key!',
		ARCANE_ADMIN_STATIC_API_KEY: apiKey,
		ARCANE_DEFAULT_ADMIN_PASSWORD: password,
		ARCANE_ANALYTICS_ENABLED: 'false',
		ARCANE_UPDATE_CHECK_ENABLED: 'false',
		// Preview images (:next) show a dev icon by default; docs should show the real logo.
		ARCANE_DEVELOPMENT_BRANDING_ENABLED: 'false'
	};
	inner(
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
	throw new Error(`Arcane did not become healthy:\n${inner('logs', '--tail', '40', container)}`);
}

function stop() {
	// Arcane, the demo project and every volume live inside the dind daemon and go with it.
	try {
		docker('rm', '-f', '-v', dind);
	} catch {}
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

// biome-ignore lint/suspicious/noExplicitAny: untyped Arcane API responses
const data = (res: any) => res?.data ?? res;

async function seed(): Promise<Seeded> {
	// v3 names the local environment after the Docker host; keep real hostnames out of the docs.
	await api('PATCH', '/agents/0', { name: 'Local Docker' });

	const form = new FormData();
	form.append('project', JSON.stringify(demoProject));
	form.append('manifest', JSON.stringify({ fileChanges: [] }));
	const created = data(await api('POST', '/agents/0/projects', undefined, { form }));
	const projectId = created.id ?? created.projectId ?? created.name;
	await api('POST', `/agents/0/projects/${projectId}/deploy?action=up`, {});

	let worker: { id: string } | undefined;
	for (let i = 0; i < 60 && !worker; i++) {
		const containers = data(await api('GET', '/agents/0/containers?search=demo-worker&limit=50'));
		const list = containers.items ?? containers.data ?? containers;
		worker = Array.isArray(list)
			? // biome-ignore lint/suspicious/noExplicitAny: untyped Arcane API responses
				list.find((c: any) =>
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
	// The sidebar logo is an <img> of an animated SVG (1.7s trace + 18 × 55ms stagger), which
	// document.getAnimations() can't see. Wait for images to load, then for the trace to finish.
	await page
		.waitForFunction(() => [...document.images].every((img) => img.complete), undefined, {
			timeout: 10_000
		})
		.catch(() => {});
	// The logo's src can change after settings load (which restarts the trace), so wait until
	// the sidebar images have been unchanged and loaded for 3.5s (max 15s).
	const logoState = () =>
		page.evaluate(() =>
			[...document.querySelectorAll('aside img, [data-sidebar] img')]
				.map(
					(img) => `${(img as HTMLImageElement).currentSrc}|${(img as HTMLImageElement).complete}`
				)
				.join(',')
		);
	let last = await logoState();
	let stableSince = Date.now();
	for (const deadline = Date.now() + 15_000; Date.now() < deadline; ) {
		await page.waitForTimeout(250);
		const now = await logoState();
		if (now !== last) {
			last = now;
			stableSince = Date.now();
		} else if (Date.now() - stableSince >= 3500) break;
	}
	// Wait for other finite animations so nothing is captured mid-transition.
	// Infinite ones (spinners, pulses) are ignored.
	await page
		.waitForFunction(
			() =>
				document
					.getAnimations()
					.every(
						(a) =>
							a.playState !== 'running' || a.effect?.getComputedTiming().iterations === Infinity
					),
			undefined,
			{ timeout: 10_000 }
		)
		.catch(() => {});
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

async function attempt(name: string, fn: () => Promise<void>, timeoutMs = stepTimeoutMs) {
	let timer: ReturnType<typeof setTimeout> | undefined;
	try {
		await Promise.race([
			fn(),
			new Promise<never>((_, reject) => {
				timer = setTimeout(
					() => reject(new Error(`timed out after ${timeoutMs / 60_000} min`)),
					timeoutMs
				);
			})
		]);
	} catch (error) {
		console.error(`screenshots: ${name} failed: ${error instanceof Error ? error.message : error}`);
		process.exitCode = 1;
	} finally {
		clearTimeout(timer);
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
		full('container-logs', `/containers/${workerId}?env=0&tab=logs`, () =>
			page.waitForTimeout(2500)
		),
		full('images-page', '/images'),
		full('projects-page', '/projects'),
		full('project-workspace', `/projects/${projectId}?env=0&tab=compose`),
		full('volumes-page', '/volumes'),
		full('volume-workspace', '/volumes/demo_demo-html?env=0&tab=workspace', async () => {
			const file = page.getByText('index.html', { exact: true }).first();
			// The file tree loads lazily in v3; open the file when it shows up, else shoot the tree.
			if (
				await file.waitFor({ timeout: 10000 }).then(
					() => true,
					() => false
				)
			)
				await file.click();
			await page.waitForTimeout(1500);
		}),
		full('networks-page', '/networks'),
		full('network-ports', '/networks/ports'),
		full('network-topology', '/networks/topology', () => page.waitForTimeout(2000)),
		full('event-log-page', '/events'),
		full('activity-center', '/settings/activity'),
		full('templates-registry-page', '/customize/templates', () => page.waitForTimeout(2000)),
		dialog('environments-page', '/agents', () =>
			page.getByRole('button', { name: 'Add Agent', exact: true }).click()
		),
		dialog('backup-schedule', '/system/backups', async () => {
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
			// The workspace folder is the default build source.
			await page.locator('#image-tags').fill('docs/demo:latest');
			await page.getByRole('button', { name: 'Build', exact: true }).first().click();
			await page.getByText('Build completed').first().waitFor({ timeout: 180_000 });
		}),
		full('vulnerabilities', '/security?tab=vulnerabilities', async () => {
			await page.getByRole('button', { name: 'Scan all images', exact: true }).first().click();
			// The first scan pulls the scanner image and vulnerability DB. Give up if no image
			// finishes scanning for 3 minutes instead of polling blindly.
			let scanned = -1;
			let lastProgress = Date.now();
			for (;;) {
				const summary = data(await api('GET', '/agents/0/vulnerabilities/summary'));
				if (summary.scannedImages >= summary.totalImages && summary.summary?.total > 0) break;
				if (summary.scannedImages !== scanned) {
					scanned = summary.scannedImages;
					lastProgress = Date.now();
				} else if (summary.summary?.total > 0 && Date.now() - lastProgress > 60_000) {
					// Some images (e.g. a scratch base) never report; enough findings to show.
					break;
				} else if (Date.now() - lastProgress > 3 * 60_000) {
					throw new Error(
						`scan stalled at ${scanned}/${summary.totalImages} images:\n${inner('logs', '--tail', '20', container)}`
					);
				}
				await page.waitForTimeout(2000);
			}
			await page.reload();
			await settle(page);
			await page.getByRole('row').filter({ hasText: /CVE-/ }).first().waitFor({ timeout: 120_000 });
		})
	];
}

async function main() {
	fs.mkdirSync(outDir, { recursive: true });
	stop();
	await start();
	// Shots overwrite in place; a failed step keeps its previous image so the docs build never breaks.
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
				if (wanted(name))
					await attempt(
						`${name} (${theme})`,
						run,
						name === 'vulnerabilities' ? scanTimeoutMs : stepTimeoutMs
					);
			}
			await ctx.close();
		}
	} finally {
		await browser.close();
		if (!process.env.KEEP) stop();
	}
}

await main();
