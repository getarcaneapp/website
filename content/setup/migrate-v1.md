---
title: 'Migrate to 1.0'
description: 'Changes and Migration to Arcane 1.0'
order: 2
---

<script lang="ts">
import { Link } from '$lib/components/ui/link/index.js';
</script>

### Before you start

- Start with a fresh database. Databases from before 1.0 cannot be upgraded in place, so you will need to set up your settings, users, and templates again.
- See the new <Link href="/docs/configuration/environment">Configuration</Link> page to make sure the right environment variables are set.

#### Overview of the major breaking changes:

- Arcane now uses port `3552` by default instead of `3000`.
- OIDC setup now finds its settings automatically from `.well-known/openid-configuration`; see <Link href="/docs/configuration/sso">SSO setup</Link>.
- Agents have been replaced with remote environments.
- Image Maturity has been removed and replaced with a simpler “update available” indicator on the Images page.
- Compose Projects (Stacks) no longer need to be imported. Arcane reads from the mounted projects folder directly. The database still stores some information, but the projects folder is what Arcane uses as the main source.

### Get started with Arcane 1.0

Below is an example compose file with the updated variables. Pin to a specific release tag (e.g. 1.0.0) instead of latest.

```yaml
services:
  arcane:
    image: ghcr.io/getarcaneapp/arcane:v1
    container_name: arcane
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - arcane-data:/app/data
      - /your/projects:/app/data/projects
      # Mount your existing projects into the default folder.
    environment:
      - APP_URL=http://localhost:3552
      - PUID=1000
      - PGID=1000
      - ENCRYPTION_KEY=xxxxxxxxxxxxxxxxxxxxxx
      - JWT_SECRET=xxxxxxxxxxxxxxxxxxxxxx
    ports:
      - '3552:3552'
    restart: unless-stopped

volumes:
  arcane-data:
```

You can also use the <Link href="/generator">Compose Generator</Link> to create a 1.0 configuration.

Open <Link href="http://localhost:3552">http://localhost:3552</Link> in your browser to
