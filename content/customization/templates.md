---
title: 'Using Templates'
description: 'Templates help you quickly deploy common applications and services with Docker Compose. Arcane supports both local templates and remote registries.'
---

<script lang="ts">
import ScreenshotFrame from '#lib/components/screenshot-frame.svelte';
</script>

Templates help you quickly deploy common apps and services with Docker Compose. Arcane supports both templates stored on your machine and templates from online registries.

## Quick Start

1. Go to **Customization → Templates**.
2. Find the template you want — search by name, or use the type filter to narrow the gallery to local or remote templates.
3. Select **Create Project** on the template card to open it as a new project.

<ScreenshotFrame
  src="/img/screenshots/templates-registry-page.jpeg"
  alt="Templates page in Arcane"
  caption="The templates gallery in Arcane."
  loading="lazy"
  decoding="async"
/>

Each card also offers **View Details** to inspect the Compose content before you use it, and remote templates offer **Download** to save a local copy for offline use.

## Template Types

### Local Templates

- Stored on your system in `data/templates` (and copied into the database for faster access)
- Arcane watches that folder and updates the list if you change a template file.

### Remote Templates

- Downloaded from online registries
- Can be used right away or downloaded for offline use

Each card is labelled **Local** or **Remote** along with the registry it came from, so you can tell at a glance where a template originates.

## Adding Local Templates

1. Open `data/templates` in your Arcane directory
2. Add your Docker Compose files (`.yaml` or `.yml`)
3. Optionally add matching `.env` files for environment variables
4. Templates appear automatically in the gallery

### Example Structure

```diff
data/templates
├── wordpress/compose.yaml
├── wordpress/.env.example
```

## Community Registry

Don't want to create your own? Use our community registry with ready-made templates:

**Registry URL:** `https://registry.getarcane.app/registry.json`

Add this in **Customization → Templates → Add Registry** to get started instantly with popular applications.
