# Arcane Documentation Website — Agent Notes

## Project Summary

- SvelteKit app using Svelte 5 (runes syntax) with Tailwind CSS 4.
- Docs content is Markdown via mdsvex and organized/validated by Velite.
- Static site build (adapter-static) with Cloudflare Workers previews/deployments.

## Key Paths

- Content source: `content/` (Markdown; mdsvex renders via layout).
- Velite config: `velite.config.js` (collections + schema).
- mdsvex config: `mdsvex.config.js` and `src/lib/components/markdown/layout.svelte`.
- Docs data/helpers: `src/lib/docs.ts`.
- Sidebar/nav config: `src/lib/config/docs.ts`.
- UI primitives: `src/lib/components/ui/` (shadcn-svelte style index exports).
- App components: `src/lib/components/`.
- Routes: `src/routes/`.

## Content Workflow

- Every Markdown file requires frontmatter: `title` and `description`.
- Place docs in the matching `content/` collection (see `velite.config.js`).
- If adding a new section, update `velite.config.js` and `SECTION_BUILDERS` in `src/lib/config/docs.ts`.

## Svelte Guidelines

- Use Svelte 5 runes: `$props`, `$state`, `$derived`, `{@render ...}`.
- Keep component structure consistent with existing patterns in `src/routes/` and `src/lib/components/`.
- When changing `.svelte` or `.svelte.ts/.svelte.js`, run the Svelte MCP fixer.

## Dev & Quality Commands (pnpm only)

- `pnpm dev` (local dev; runs Velite watcher + Vite)
- `pnpm build`
- `pnpm check`
- `pnpm lint`
- `pnpm format`
- `pnpm fallow`

## Build/Runtime Notes

- Icons are provided through Iconify/unplugin-icons virtual Svelte imports.
- Static build output goes to `build/` with `index.html` fallback.

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->
