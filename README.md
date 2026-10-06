# Arcane Documentation Website

This repository holds [getarcane.app](https://getarcane.app): the landing page, documentation, blog, changelog, and tools like the Compose generator. It's built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build), and uses [Vite+](https://viteplus.dev) for formatting, linting, and the commit hook.

## Developing

Install the dependencies and start the development server:

```bash
vp install
vp run dev
```

The site runs at `http://localhost:3001`. `vp run build` builds it, and `vp run check` runs the type check, formatter, and linter.

## Structure

| Path                     | Contents                                                           |
| ------------------------ | ------------------------------------------------------------------ |
| `src/content/docs/docs/` | Documentation pages, one Markdown (or MDX) file per page           |
| `src/content/blog/`      | Blog posts                                                         |
| `src/content/changelog/` | Release notes by year, generated from GitHub releases              |
| `src/lib/config/docs.ts` | Sidebar and header navigation                                      |
| `src/pages/`             | The landing page and the pages outside the docs                    |
| `src/components/`        | Starlight overrides, content components, and client-side widgets   |
| `src/worker.ts`          | Cloudflare Worker: redirects, Discord presence, binary downloads   |
| `static/`                | Files served as-is (install scripts, `config.json`, SBOMs, images) |

## Deployment

The site deploys to Cloudflare Workers with Wrangler. The build is fully static; a small Worker in front of it handles the redirects for moved pages, the Discord presence endpoint and the preview binary downloads from R2.

Pull request previews are served on a custom `pr-**.arcane.ofkm.workers.dev` domain.
