---
title: 'Templates'
description: 'Start new Compose projects from local templates or online registries.'
---

<script lang="ts">
import { Link } from '#lib/components/ui/link/index.js';
import ScreenshotFrame from '#lib/components/screenshot-frame.svelte';
</script>

A template is a ready-made Compose file, optionally with an env file, that you can turn into a new project. Use one for apps you deploy often or want to share.

## Create a project from a template

1. Go to **Customization → Templates**.
2. Search by name, or filter by local or remote templates.
3. Select **Create Project** on the template card.

<ScreenshotFrame
  src="/img/screenshots/templates-registry-page.jpeg"
  alt="Community Compose templates with application descriptions and categories."
  caption="Browse community templates before creating a Compose project."
  loading="lazy"
  decoding="async"
/>

**View Details** shows the Compose file first. **Download** saves a remote template locally for offline use.

## Add a local template

Local templates live in the **Templates Directory**, `/app/data/templates` in Arcane's data volume by default. Change it with `TEMPLATES_DIRECTORY` or on the environment's **Storage & Limits** tab.

1. Create a folder in the Templates Directory. Its name becomes the template name.
2. Add a Compose file, such as `compose.yaml`.
3. Optional: add a `.env.example` or `.env` file.

Arcane watches the directory and adds the template to the gallery. Compose files outside a folder are ignored.

```text
/app/data/templates
└── wordpress
    ├── compose.yaml
    └── .env.example
```

## Add a template registry

Remote templates come from registries; each card names its source. To add the community registry, go to **Customization → Templates → Add Registry** and enter:

```text
https://registry.getarcane.app/registry.json
```

To publish your own, see <Link href="/docs/docker/template-registries">Template Registries</Link>.
