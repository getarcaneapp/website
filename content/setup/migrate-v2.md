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
- After upgrade, verify at least one global Admin exists and assign any environment-scoped roles you need.
- The last-global-admin guard is enforced at runtime — you cannot remove the final global Admin through the UI or API. A missing-admin state at startup is logged but does not halt Arcane, so confirm a global Admin exists after upgrading.

See <Link href="/docs/security/rbac">Role-Based Access Control</Link> for the role catalog.

## 2. Replace OIDC admin claims

- Remove `OIDC_ADMIN_CLAIM`, `OIDC_ADMIN_VALUE`, `oidcAdminClaim`, and `oidcAdminValue`.
- Configure `OIDC_GROUPS_CLAIM` and `OIDC_ROLE_MAPPINGS` instead.
- Recreate old admin-claim behavior by mapping the old claim value to `role_admin`.

If your 1.x Compose file granted admins from a group claim:

```yaml
services:
  arcane:
    environment:
      OIDC_SCOPES: openid email profile groups
      OIDC_ADMIN_CLAIM: groups
      OIDC_ADMIN_VALUE: arcane-admins
```

Change it to request the same group claim and declare the replacement role mapping in env:

```yaml
services:
  arcane:
    environment:
      OIDC_SCOPES: openid email profile groups
      OIDC_GROUPS_CLAIM: groups
      OIDC_ROLE_MAPPINGS: >-
        [
          {"claimValue":"arcane-admins","roleId":"role_admin"}
        ]
```

For multiple groups or environment-scoped roles, add more entries:

```yaml
services:
  arcane:
    environment:
      OIDC_SCOPES: openid email profile groups
      OIDC_GROUPS_CLAIM: groups
      OIDC_ROLE_MAPPINGS: >-
        [
          {"claimValue":"arcane-admins","roleId":"role_admin"},
          {"claimValue":"arcane-devops","roleId":"role_editor","environmentId":"env-prod"}
        ]
```

Omit `environmentId` for a global role assignment. Include it when the role should apply only to one environment. Env-managed mappings are reconciled at boot.

For Docker secrets or large mapping lists, current v2 builds also support `OIDC_ROLE_MAPPINGS_FILE`:

```yaml
services:
  arcane:
    secrets:
      - oidc-role-mappings
    environment:
      OIDC_GROUPS_CLAIM: groups
      OIDC_ROLE_MAPPINGS_FILE: /run/secrets/oidc-role-mappings

secrets:
  oidc-role-mappings:
    file: ./oidc-role-mappings.json
```

See <Link href="/docs/security/rbac#oidc-group-mappings">OIDC group mappings</Link> and <Link href="/docs/configuration/sso">SSO setup</Link>.

## 3. Review API keys and automation

- Existing API keys are backfilled with a snapshot of their owner's current permissions.
- Future owner role changes do not update existing keys.
- Recreate or edit CI/CD keys so they only have the permissions they need.
- New API keys created through the API or CLI must include explicit permission grants.
- Update scripts that use removed user role payloads, dashboard action-items, `arcane alerts`, public event creation, or Apprise commands.
- The user API no longer returns a flat `roles` array — scripts that read user roles from `GET /users` must use `roleAssignments` and `isGlobalAdmin` instead.
- Use same-origin/trusted-origin browser calls or Bearer/API-key auth for state-changing API requests.

New API key create/update payloads need explicit permission grants:

```json
{
  "name": "production deploy bot",
  "permissions": [
    { "permission": "projects:list", "environmentId": "env-prod" },
    { "permission": "projects:read", "environmentId": "env-prod" },
    { "permission": "projects:deploy", "environmentId": "env-prod" }
  ]
}
```

Use environment-scoped grants for automation that only touches one Docker environment. Omit `environmentId` only for permissions that should apply globally.

For CI/CD, consider short-lived credentials from <Link href="/docs/security/federated-credentials">Federated Credentials</Link> instead of long-lived API keys.

## 4. Remove deleted settings and integrations

- Move Apprise notifications to supported providers.
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
- Set `APP_URL` to the exact URL your browser uses to reach Arcane (scheme, host, and port). v2 blocks cookie-authenticated cross-origin writes, so a missing or mismatched `APP_URL` causes `403 Cross-origin request blocked` errors in the UI. Behind a reverse proxy, also configure <Link href="/docs/configuration/websockets-reverse-proxies#trust-the-proxy-with-trusted_proxies">trusted proxies</Link>.
- Stop relying on root-owned writes from the Arcane container.
- Check write permissions for `/app/data`, your projects directory, `/builds`, and `/backups`.
- Use `PUID` and `PGID` only if bind-mounted host files need a specific host owner.
- If you use a Docker socket proxy, keep `DOCKER_HOST` configured and make sure the proxy allows the Docker API calls Arcane needs.

For a Compose-based install, the image and runtime edit usually looks like this:

```yaml
services:
  arcane:
    image: ghcr.io/getarcaneapp/manager:v2
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - arcane-data:/app/data
      - /host/path/to/projects:/app/data/projects
    environment:
      APP_URL: http://localhost:3552
      ENCRYPTION_KEY: your-existing-encryption-key
      JWT_SECRET: your-existing-jwt-secret
      PUID: "1000"
      PGID: "1000"
```

If you use a Docker socket proxy, keep the proxy host setting in the same Compose service:

```yaml
services:
  arcane:
    image: ghcr.io/getarcaneapp/manager:v2
    environment:
      DOCKER_HOST: tcp://docker-socket-proxy:2375
```

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
- the UI can save changes without "Cross-origin request blocked" errors (`APP_URL` is correct)
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
