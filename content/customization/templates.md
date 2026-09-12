---
title: 'Using Templates'
description: 'Create Compose projects from local templates or online registries.'
---

<script lang="ts">
import ScreenshotFrame from '#lib/components/screenshot-frame.svelte';
</script>

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

Use **View Details** to review the Compose file first. **Download** saves a remote template for offline use.

## Template Types

### Local Templates

Stored in `data/templates` and cached in the database. Arcane watches for file changes.

### Remote Templates

Loaded from online registries. Each card names its source.

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

**Registry URL:** `https://registry.getarcane.app/registry.json`

Add this URL in **Customization → Templates → Add Registry** to browse its templates.
