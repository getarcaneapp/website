# Copilot Instructions for Arcane Documentation Website

## Architecture Overview

This is a **SvelteKit-based documentation website** for Arcane (a Docker management platform) built with modern tooling:

- **SvelteKit 2.0** with **Svelte 5** (runes syntax)
- **TailwindCSS 4** with custom design system
- **mdsx** for Markdown-in-Svelte processing
- **Velite** for content collection management
- **shadcn-svelte** UI component library (heavily customized)
- **pnpm** for package management (enforced via preinstall hook)

## Key Development Patterns

### Component Architecture
- **UI Components**: Located in `src/lib/components/ui/` following shadcn-svelte patterns
- **Custom Components**: Business logic components in `src/lib/components/`
- **MDSX Components**: Markdown renderers in `src/lib/components/mdsx/`
- **Index Exports**: Each UI component directory has `index.ts` for clean imports

### Content Management
- **Content Source**: Markdown files in `/content/` organized by category
- **Collection Config**: Defined in `velite.config.js` with schema validation
- **Content Types**: `gettingStarted`, `userManagement`, `features`, `guides`, `development`
- **Frontmatter**: Every `.md` file requires `title` and `description`

### Styling Conventions
- **Design System**: Custom CSS variables in `src/app.css` with light/dark theme support
- **Component Variants**: Using `tailwind-variants` for component styling
- **Utility Classes**: Custom utilities like `@utility container`, `@utility no-scrollbar`
- **Icon Usage**: Lucide icons imported individually: `import IconName from '@lucide/svelte/icons/icon-name.svelte'`

### Svelte 5 Patterns
- **Runes Syntax**: Use `$state`, `$derived`, `$props` instead of old reactive syntax
- **Snippets**: Use `{@render children?.()}` for slot content
- **Binding**: Use `bind:this={ref}` for element references
- **Props Destructuring**: `let { prop = defaultValue } = $props()`

## Essential Commands

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Production build
pnpm preview               # Preview build locally

# Code Quality
pnpm check                 # Type checking
pnpm format                # Prettier formatting
pnpm lint                  # Lint check

# Content
# Content is auto-processed by Velite on file changes
```

## Content Creation Workflow

1. **Add Markdown**: Create `.md` files in appropriate `/content/` subdirectory
2. **Update Collection**: Ensure file matches pattern in `velite.config.js`
3. **Navigation**: Add to `src/lib/config/docs.ts` for sidebar navigation
4. **Components**: Use MDSX components in frontmatter script tags if needed

## Component Usage Patterns

### UI Components
```svelte
// Import pattern
import * as Card from '$lib/components/ui/card/index.js';
import { Button } from '$lib/components/ui/button/index.js';

// Usage with proper data attributes
<Card.Root data-slot="card">
  <Card.Header>
    <Card.Title>Title</Card.Title>
  </Card.Header>
</Card.Root>
```

### Code Highlighting
```svelte
import * as Code from '$lib/components/ui/code/index.js';

<Code.Root lang="typescript" code={codeString}>
  <Code.CopyButton size="sm" variant="ghost" />
</Code.Root>
```

### Docker Compose Generator
- **Location**: `src/routes/generator/+page.svelte`
- **Logic**: `src/lib/utils/docker-compose-generator.ts`
- **Types**: `src/lib/types/compose-config.type.ts`
- **Pattern**: Form state management with reactive YAML generation

## File Organization Logic

- `src/lib/components/ui/`: Reusable UI primitives (buttons, cards, etc.)
- `src/lib/components/`: App-specific components (header, sidebar, etc.)
- `src/lib/config/`: Configuration objects (navigation, features, etc.)
- `src/lib/utils/`: Utility functions and helpers
- `src/lib/types/`: TypeScript type definitions
- `content/`: Markdown documentation organized by category

## Critical Dependencies

- **Mode Watcher**: Theme switching functionality
- **Bits UI**: Headless component primitives
- **Shiki**: Syntax highlighting with custom theme support
- **Velite**: Content processing and validation
- **MDSX**: Allows Svelte components in Markdown

## Development Guidelines

1. **Type Safety**: All components should have proper TypeScript definitions
2. **Accessibility**: Use semantic HTML and ARIA attributes from Bits UI
3. **Performance**: Leverage Svelte's compile-time optimizations
4. **Consistency**: Follow existing patterns for component structure and naming
5. **Content**: Always validate markdown frontmatter matches schema requirements
