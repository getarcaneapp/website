# Arcane Documentation Website — Agent Notes

## Project Summary
- SvelteKit app using Svelte 5 (runes syntax) with Tailwind CSS 4.
- Docs content is Markdown via MDSX and organized/validated by Velite.
- Static site build (adapter-static) with Cloudflare Workers previews/deployments.

## Key Paths
- Content source: `content/` (Markdown; MDSX renders via blueprint).
- Velite config: `velite.config.js` (collections + schema).
- MDSX config: `mdsx.config.js` and `src/lib/components/mdsx/blueprint.svelte`.
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
- `pnpm dev:wrangler` (Workers dev)
- `pnpm build`
- `pnpm preview`
- `pnpm check`
- `pnpm lint` / `pnpm lint:fix`
- `pnpm format` / `pnpm format:check`

## Build/Runtime Notes
- Vite config excludes `@lucide/svelte` from optimizeDeps and chunks icons separately.
- Static build output goes to `build/` with `index.html` fallback.
