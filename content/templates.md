---
title: 'Using Templates'
description: 'Templates help you quickly deploy common applications and services with Docker Compose. Arcane supports both local templates and remote registries.'
---

# Using Templates

Templates help you quickly deploy common applications and services with Docker Compose. Arcane supports both local templates and remote registries.

## Quick Start

1. Navigate to the Compose Projects page and `Create a New Project`
2. Click the dropdown on the button in the top right and choose `Use Template`
3. Select the template you would like to use

> [!NOTE]
> Templates are sorted by the registry they came from or in the `Local` category

4. Click Use Now and have fun with your new container! 

## Template Types

### Local Templates

- Stored on your system in `data/templates` (and in the database for faster access)
- The file system watcher utility will auto sync the local templates to the database if you make changes to the files locally.

### Remote Templates

- Downloaded from online registries
- Can be used immediately or downloaded for offline use

## Using the Template Dialog

When you click **Choose Template**, you'll see:

- **Local Templates:** Ready to use immediately
- **Remote Templates:** Two options for each:
  - **Use Now:** Load template content directly into your stack
  - **Download:** Save template locally for future offline use
- Templates with environment files will show an **ENV** badge and include pre-configured variables.

## Adding Local Templates

1. Navigate to `data/templates` in your Arcane directory
2. Add your Docker Compose files (`.yaml` or `.yml`)
3. Optionally add matching `.env` files for environment variables
4. Templates appear automatically in the template dialog

### Example Structure

```diff
data/templates
├── wordpress/compose.yaml
├── wordpress/.env.example
```

## Community Registry

Don't want to create your own? Use our community registry with pre-built templates:

**Registry URL:** `https://templates.arcane.ofkm.dev/registry.json`

Add this in **Settings → Templates → Add Registry** to get started instantly with popular applications.
