import starlight from '@astrojs/starlight';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import starlightLinksValidator from 'starlight-links-validator';
import Icons from 'unplugin-icons/vite';
import { DISCORD_URL, GITHUB_REPO, sidebar } from './src/lib/config/docs.ts';
import { arcaneMarkdown } from './src/lib/markdown/index.ts';
import { sharedHead } from './src/sharedHead.ts';

const site = 'https://getarcane.app';

export default defineConfig({
	site,
	trailingSlash: 'never',
	publicDir: './static',
	build: { format: 'file' },
	image: {
		remotePatterns: [
			{ protocol: 'https', hostname: 'i.ytimg.com' },
			{ protocol: 'https', hostname: 'miro.medium.com' },
			{ protocol: 'https', hostname: 'www.virtualizationhowto.com' }
		]
	},
	vite: {
		plugins: [tailwindcss(), Icons({ compiler: 'svelte', autoInstall: false })],
		build: {
			rolldownOptions: {
				onLog(level, log, handler) {
					if (log.code === 'MODULE_LEVEL_DIRECTIVE' && log.message.includes('astro:head-inject'))
						return;
					handler(level, log);
				}
			}
		}
	},
	integrations: [
		arcaneMarkdown(),
		svelte(),
		starlight({
			title: 'Arcane',
			description: 'Arcane - Docker Management, Designed for Everyone.',
			favicon: '/img/favicon.ico',
			head: sharedHead(site),
			routeMiddleware: './src/routeData.ts',
			logo: { src: './src/assets/logo.svg' },
			customCss: ['./src/styles/global.css'],
			plugins: [
				starlightLinksValidator({
					errorOnLocalLinks: false,
					exclude: [
						'/',
						'/blog',
						'/blog/**',
						'/changelog',
						'/community',
						'/generator',
						'/sbom',
						'/rss.xml'
					]
				})
			],
			components: {
				Header: './src/components/overrides/Header.astro',
				SocialIcons: './src/components/overrides/SocialIcons.astro',
				PageTitle: './src/components/overrides/PageTitle.astro',
				ThemeSelect: './src/components/overrides/ThemeSelect.astro',
				Footer: './src/components/overrides/Footer.astro',
				MobileMenuFooter: './src/components/overrides/MobileMenuFooter.astro',
				PageSidebar: './src/components/overrides/PageSidebar.astro',
				TwoColumnContent: './src/components/overrides/TwoColumnContent.astro'
			},
			expressiveCode: {
				themes: ['github-dark-default', 'github-light-default'],
				shiki: { langAlias: { nginxconf: 'nginx', env: 'dotenv' } },
				styleOverrides: {
					borderRadius: '0.75rem',
					borderColor: 'var(--sl-color-hairline)',
					codeBackground: 'var(--code-bg)',
					codeFontSize: '0.8125rem',
					codeLineHeight: '1.65',
					frames: {
						shadowColor: 'transparent',
						editorBackground: 'var(--code-bg)',
						terminalBackground: 'var(--code-bg)',
						editorTabBarBackground: 'var(--code-chrome)',
						editorActiveTabBackground: 'var(--code-bg)',
						editorTabBarBorderBottomColor: 'var(--sl-color-hairline)',
						terminalTitlebarBackground: 'var(--code-chrome)',
						terminalTitlebarDotsForeground: 'transparent',
						terminalTitlebarDotsOpacity: '0',
						terminalTitlebarBorderBottomColor: 'var(--sl-color-hairline)',
						editorActiveTabIndicatorTopColor: 'transparent',
						editorActiveTabIndicatorBottomColor: 'var(--sl-color-accent)'
					}
				}
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: `https://github.com/${GITHUB_REPO}` },
				{ icon: 'discord', label: 'Discord', href: DISCORD_URL }
			],
			editLink: { baseUrl: 'https://github.com/getarcaneapp/website/edit/main/' },
			lastUpdated: false,
			sidebar
		})
	]
});
