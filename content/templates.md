---
title: 'Using Templates'
description: 'Templates help you quickly deploy common applications and services with Docker Compose. Arcane supports both local templates and remote registries.'
---

# Using Templates

Templates help you quickly deploy common apps and services with Docker Compose. Arcane supports both templates stored on your machine and templates from online registries.

## Quick Start

1. Go to the Compose Projects page and click `Create a New Project`
2. Click the dropdown on the button in the top right and choose `Use Template`
3. Select the template you would like to use

> [!NOTE]
> Templates are grouped by where they came from, or shown in the `Local` category if they are stored on your machine.

4. Click `Use Now` to start using the template.

## Template Types

### Local Templates

- Stored on your system in `data/templates` (and copied into the database for faster access)
- Arcane watches that folder and updates the list if you change a template file.

### Remote Templates

- Downloaded from online registries
- Can be used right away or downloaded for offline use

## Using the Template Dialog

When you click **Choose Template**, you'll see:

- **Local Templates:** Ready to use immediately
- **Remote Templates:** two options for each:
  - **Use Now:** load the template into your project right away
  - **Download:** save the template locally for later use
- Templates with environment files show an **ENV** badge and include ready-made variables.

## Adding Local Templates

1. Open `data/templates` in your Arcane directory
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

Don't want to create your own? Use our community registry with ready-made templates:

**Registry URL:** `https://registry.getarcane.app/registry.json`

Add this in **Settings → Templates → Add Registry** to get started instantly with popular applications.
