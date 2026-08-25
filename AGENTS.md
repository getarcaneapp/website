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

- Every Markdown file requires frontmatter: `title` and `description`. Do not write an `# H1` — the route renders `title` and `description` above your content.
- Place docs in the matching `content/` collection (see `velite.config.js`). Top-level folders match sidebar groups: `get-started/`, `upgrade/`, `features/`, `customization/`, `configuration/`, `authentication/`, `networking/`, `security/`, `guides/`, `cli/`, `development/`.
- To make a new page appear in the sidebar, add a `leaf('<dir>/<name>')` call to the right `group(...)` array in `src/lib/config/docs.ts`, **at the position you want it displayed**. Sidebar order is literal array order — the `published` flag is the only frontmatter the nav reads. Without a `leaf()` the page still builds and is reachable by URL, but is invisible in the sidebar, the `/docs` index, mobile nav, and the prev/next pager.
- If adding a new group, also add it to `sectionNavItems` in the same file and add a matching key to `SECTION_META` in `src/lib/components/docs-index.svelte`. The `SECTION_META` key must match the group title exactly or the card silently disappears from `/docs`.
- If adding a new top-level directory, define the collection in `velite.config.js` and register it in `ALL_DOCS` in `src/lib/config/docs.ts`.
- Cross-link with `<Link href="/docs/...">` (root-relative, no `.md`). Callouts are GitHub-style blockquote markers: `> [!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]`.
- Do not hand-edit `static/config.json`, `content/changelog/*`, or `static/sbom/` — CI regenerates them from the latest Arcane release.
- If you rename or move a content file, add a 301 from the old `/docs/...` path in `src/_worker.js` (`DOC_REDIRECTS`). The static adapter has no redirect layer of its own.

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

**Never start, stop, restart, or curl the local dev server.** A `pnpm dev` is already running at all times. Do not run `pnpm dev`, `vp dev`, `vite`, or `velite --watch`. Do not kill processes on ports 3001/3002. Edit files and let the existing server hot-reload.

`pnpm build` is the real gate for content changes: every doc is prerendered and `getDoc` throws a 404 on an unknown slug, so a broken internal `/docs/...` link or a missing `#anchor` fails the build. Run it after any content edit.

`pnpm fallow` reports components imported only from Markdown as dead code — add any new one to `dynamicallyLoaded` in `.fallowrc.jsonc` first.

## Build/Runtime Notes

- Icons are provided through Iconify/unplugin-icons virtual Svelte imports.
- Static build output goes to `build/` with `index.html` fallback.

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->
