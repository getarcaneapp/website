---
title: 'Migrate to 2.0'
description: 'Prepare an Arcane 1.x installation for Arcane 2.0.'
order: 2
---

<script lang="ts">
import { Link } from '$lib/components/ui/link/index.js';
</script>

> [!CAUTION]
> Arcane 2.0 is a breaking release. Back up your data before changing the image tag.

# Before you start

Back up anything needed to restore Arcane 1.x:

- the Arcane database
- the full `/app/data` folder or named volume
- your Compose file and any environment files it loads
- your projects directory
- any Edge mTLS assets if you use remote environments

If you use SQLite with the default `arcane-data` volume, stop Arcane before copying the volume so the database is not changing while you back it up.

# Breaking changes at a glance

- RBAC replaces the legacy user `admin` flag.
- OIDC admin claims are removed. OIDC group mappings replace them.
- API keys now have explicit permission grants.
- Apprise support is removed from the UI, API, CLI, and database.
- Deprecated scheduled prune settings are removed.
- `gitopsSyncInterval` is removed. GitOps sync intervals are now per sync.
- Non-URL custom icon values are resolved through the selected icon catalog.
- Legacy remote bootstrap-token pairing is removed.
- Plaintext Edge mTLS CA key migration is removed.
- Official images now run as a hardened non-root user by default.
- Some API and CLI automation surfaces changed or were removed:
  - user role create/update payloads
  - dashboard action-items endpoint
  - `arcane alerts`
  - public API-key-backed event creation
  - cookie-authenticated cross-origin writes

# Migration steps

## 1. Prepare auth and permissions

- Legacy admins become **global Admins**.
- Other users become **global Viewers**.
- After upgrade, review **Settings > Users** and assign the right roles per environment.
- The migration will not continue if it would leave the instance with zero global admins.

See <Link href="/docs/security/rbac">Role-Based Access Control</Link> for the role catalog.

## 2. Replace OIDC admin claims

- Remove `OIDC_ADMIN_CLAIM`, `OIDC_ADMIN_VALUE`, `oidcAdminClaim`, and `oidcAdminValue`.
- Configure `OIDC_GROUPS_CLAIM` and role mappings instead.
- Recreate old admin-claim behavior under **Settings > OIDC Mappings**.

See <Link href="/docs/security/rbac#oidc-group-mappings">OIDC group mappings</Link> and <Link href="/docs/configuration/sso">SSO setup</Link>.

## 3. Review API keys and automation

- Existing API keys are backfilled with a snapshot of their owner's current permissions.
- Future owner role changes do not update existing keys.
- Recreate or edit CI/CD keys so they only have the permissions they need.
- New API keys created through the API or CLI must include explicit permission grants.
- Update scripts that use removed user role payloads, dashboard action-items, `arcane alerts`, public event creation, or Apprise commands.
- Use same-origin/trusted-origin browser calls or Bearer/API-key auth for state-changing API requests.

For CI/CD, consider short-lived credentials from <Link href="/docs/security/federated-credentials">Federated Credentials</Link> instead of long-lived API keys.

## 4. Remove deleted settings and integrations

- Move Apprise notifications to supported providers in <Link href="/docs/configuration/notifications">Settings > Notifications</Link>.
- Stop relying on removed scheduled prune compatibility settings:
  - `dockerPruneMode`
  - `scheduledPruneContainers`
  - `scheduledPruneImages`
  - `scheduledPruneVolumes`
  - `scheduledPruneNetworks`
  - `scheduledPruneBuildCache`
- Stop relying on removed OIDC compatibility setting `authOidcConfig`.
- Review each GitOps sync interval. The old global `gitopsSyncInterval` setting is gone.

## 5. Check custom icons

Existing absolute `http://` and `https://` icon URLs still work. Non-URL icon values are treated as icon catalog slugs.

If you use Compose metadata or container labels, prefer:

- `x-arcane.icon-light` and `x-arcane.icon-dark`
- `com.getarcaneapp.arcane.icon-light` and `com.getarcaneapp.arcane.icon-dark`

See <Link href="/docs/guides/custom-metadata">Custom Metadata</Link>.

## 6. Update remote environments

- Re-pair old remote agents that still use bootstrap-token pairing.
- If you use Edge mTLS, upgrade to a current 1.x release first so generated CA private keys are already encrypted.

## 7. Update the container image and runtime

- Change the image to `ghcr.io/getarcaneapp/manager:v2`.
- Stop relying on root-owned writes from the Arcane container.
- Check write permissions for `/app/data`, your projects directory, `/builds`, and `/backups`.
- Use `PUID` and `PGID` only if bind-mounted host files need a specific host owner.
- If you use a Docker socket proxy, keep `DOCKER_HOST` configured and make sure the proxy allows the Docker API calls Arcane needs.

## 8. Upgrade

1. Stop Arcane:

```bash
docker compose down
```

2. Take the backups listed above if you have not already.

3. Update your Compose file to use `ghcr.io/getarcaneapp/manager:v2`.

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
- at least one user is a global Admin
- non-admin users have the right roles
- OIDC group mappings work, if used
- API keys and scripts have the permissions they need
- projects and GitOps sync intervals still load correctly
- Activity Center records long-running actions
- notifications use supported providers
- remote environments connect
- Arcane can write to mounted data, projects, builds, and backup paths

# Roll back

Stop Arcane, restore the database and `/app/data` backup from before the upgrade, then start the previous v1 image tag again. Do not start a v1 container against a database that has already been migrated by v2.
