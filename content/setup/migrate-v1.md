---
title: 'Migrate to 1.0'
description: 'Changes and Migration to Arcane 1.0'
---

<script lang="ts">
import { Link } from '$lib/components/ui/link/index.js';
</script>

### Before you start

- Use a fresh database; databases from pre-1.0 cannot apply the new migrations. You’ll need to reconfigure settings, users, and templates.
- See the new <Link href="/docs/configuration/environment">Configuration</Link> to ensure the correct environment variables are set.

#### Overview of the major breaking changes:

- The port Arcane runs on has changed from `3000` to `3552` by default.
- The OIDC configuration now uses the `.well-known/openid-configuration` endpoint to auto-discover endpoints; see <Link href="/docs/configuration/sso">SSO setup</Link>.
- Agents have been replaced with remote environments (a simplified Arcane runtime instead of a separate agent).
- Image Maturity has been removed and replaced with a simpler “update available” indicator on the Images page.
- Compose Projects (Stacks) no longer need to be imported. Arcane reads from the mounted projects directory and runs commands directly from that folder. The database still stores some metadata, but the source of truth is the projects folder.

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
