---
title: 'Migrate to 2.0'
description: 'Prepare an Arcane 1.x installation for Arcane 2.0.'
order: 2
---

<script lang="ts">
import { Link } from '$lib/components/ui/link/index.js';
</script>

> [!CAUTION]
> Arcane 2.0 is a breaking release. Back up your data before changing the image tag, and review each migration item below before you start the new container.

## Before you start

Back up the files and data Arcane needs to recover your installation:

- the Arcane database
- the full `/app/data` folder or named volume
- your Compose file and any environment files it loads
- your projects directory
- any Edge mTLS assets if you use remote environments

If you use SQLite with the default `arcane-data` volume, stop Arcane before copying the volume contents so the database is not changing while you back it up.

## Review the breaking changes

### Apprise has been removed

Arcane 2.0 removes Apprise support from the UI, API, and CLI. The v2 database migration also drops the `apprise_settings` table.

Before upgrading, move any Apprise notifications to the built-in notification providers in <Link href="/docs/configuration/notifications">Settings > Notifications</Link>. After upgrading, Apprise settings cannot be managed or recovered from Arcane.

### Deprecated settings are removed

Arcane 2.0 removes old compatibility settings that were kept for earlier migrations:

- `dockerPruneMode`
- `scheduledPruneContainers`
- `scheduledPruneImages`
- `scheduledPruneVolumes`
- `scheduledPruneNetworks`
- `scheduledPruneBuildCache`
- `authOidcConfig`

Before upgrading, review your current settings and replace these legacy values with the current settings in Arcane. These should already be migrated if you are on the latest 1.19.x release.

For OIDC, do not rely on the old `authOidcConfig` JSON value. Configure OIDC with the current individual OIDC settings instead. See <Link href="/docs/configuration/sso">SSO setup</Link>.

For scheduled pruning, review the current scheduled prune settings in the Arcane UI. The old per-resource boolean compatibility rows are deleted during the v2 migration.

### Legacy remote environment pairing is removed

Arcane 2.0 removes the legacy bootstrap-token pairing flow for remote environments. Update remote environments to use the current access token or API key flow before upgrading.

If you still have old setup notes or automation that sends a bootstrap token while creating or updating an environment, replace that automation before moving the manager to v2.

### Plaintext Edge mTLS CA keys are no longer migrated

Arcane 2.0 expects generated Edge mTLS CA private keys to already use Arcane's encrypted envelope format. The old plaintext CA key migration path has been removed.

If you use Edge mTLS for remote environments, verify the CA key was migrated by a current 1.x release before upgrading. A plaintext CA private key may prevent v2 from loading the Edge mTLS CA.

### Official images use a hardened non-root runtime

Official Arcane images now use a hardened runtime and drop to a non-root user by default. If `PUID` and `PGID` are not set, Arcane runs as `65532:65532`.

Set `PUID` and `PGID` only when bind-mounted host files should be owned by a specific host user and group. If you use the mounted Docker socket, Arcane maps the socket group automatically. If you use `DOCKER_HOST` with a socket proxy, no Unix socket group mapping is needed.

Check permissions for any bind mounts Arcane writes to, especially:

- `/app/data`
- your projects directory
- `/builds`
- `/backups`, if mounted

## Update your Compose file

Update your Arcane service to use the v2 image tag and the current runtime settings.

```yaml
services:
  arcane:
    image: ghcr.io/getarcaneapp/arcane:v2
    container_name: arcane
    ports:
      - '3552:3552'
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - arcane-data:/app/data
      - /host/path/to/projects:/host/path/to/projects
      - /host/path/to/builds:/builds
    environment:
      - ENCRYPTION_KEY=xxxxxxxxxxxxxxxxxxxxxx
      - JWT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxx
      - PROJECTS_DIRECTORY=/host/path/to/projects
      # Optional: run Arcane as a specific host UID/GID instead of the default runtime user.
      # When using the mounted Docker socket, Arcane will map the socket group automatically.
      # - PUID=1000
      # - PGID=1000
      - TZ=UTC
    cgroup: host
    healthcheck:
      test:
        [
          'CMD',
          'curl',
          '-fsS',
          'http://localhost:3552/api/health'
        ]
      interval: 10s
      timeout: 3s
      retries: 5
      start_period: 15s
    restart: unless-stopped

volumes:
  arcane-data:
```

If you use a Docker socket proxy, keep `DOCKER_HOST=tcp://docker-socket-proxy:2375` and make sure the proxy still allows the Docker API operations Arcane needs.

## Upgrade

1. Stop Arcane:

```bash
docker compose down
```

2. Take the backups listed above.

3. Update your Compose file to use `ghcr.io/getarcaneapp/arcane:v2`.

4. Start Arcane:

```bash
docker compose up -d
```

5. Watch the logs while the database migration runs:

```bash
docker compose logs -f arcane
```

6. Open <Link href="http://localhost:3552">http://localhost:3552</Link> and verify:

- users can sign in
- projects still load
- notifications use built-in providers
- scheduled prune settings are still correct
- remote environments connect without legacy bootstrap-token pairing
- Arcane can write to its mounted data, projects, builds, and backup paths

## If you need to roll back

Stop Arcane, restore the database and `/app/data` backup from before the upgrade, then start the previous v1 image tag again. Do not start a v1 container against a database that has already been migrated by v2.
