---
title: 'Migrate to 2.0'
description: 'Prepare an Arcane 1.x installation for Arcane 2.0 and upgrade it.'
---

<script lang="ts">
import { Link } from '#lib/components/ui/link/index.js';
</script>

> [!CAUTION]
> Arcane 2.0 is a breaking release. It replaces the per-user admin flag with role-based access control (RBAC), gives API keys their own permissions, removes several old settings and integrations, and runs as a non-root user. Work through the steps below before you change the image tag on a 1.x installation.

## Breaking changes at a glance

- RBAC replaces the legacy user `admin` flag.
- OIDC admin claims are removed. OIDC group mappings replace them.
- API keys have explicit permission grants.
- Apprise support is removed from the UI, API, CLI, and database.
- Deprecated scheduled prune settings are removed.
- `gitopsSyncInterval` is removed. Each GitOps sync has its own interval.
- Non-URL custom icon values are resolved through the selected icon catalog.
- Legacy remote bootstrap-token pairing is removed.
- Plaintext Edge mTLS CA key migration is removed.
- Official images run as a hardened non-root user by default.
- Some API and CLI features changed or were removed:
  - user role create/update payloads
  - dashboard action-items endpoint
  - `arcane alerts`
  - public API-key-backed event creation
  - cookie-authenticated cross-origin writes

## 1. Back up your data

Back up everything you'd need to restore Arcane 1.x:

- the Arcane database
- the full `/app/data` folder or named volume
- your Compose file and any environment files it loads
- your projects directory
- any Edge mTLS assets (the certificates Edge agents use to authenticate to the Manager), if you use remote environments

If you use SQLite with the default `arcane-data` volume, stop Arcane before copying the volume so the database doesn't change during the backup.

## 2. Plan roles and permissions

During the upgrade, Arcane assigns roles from the old admin flag:

- Legacy admins become **global Admins**.
- Other users become **global Viewers**.

After the upgrade, check that at least one global Admin exists and assign any environment-scoped roles you need. If Arcane finds no global Admin at startup, it logs `RBAC global admin guard failed` and keeps running, so don't rely on the log alone. The UI and API won't let you remove the last global Admin assignment.

See <Link href="/docs/access/roles">Roles</Link> for the role catalog.

## 3. Replace OIDC admin claims

Remove `OIDC_ADMIN_CLAIM` and `OIDC_ADMIN_VALUE` (and the `oidcAdminClaim` and `oidcAdminValue` settings). Instead, set `OIDC_GROUPS_CLAIM` to the claim that carries your groups, and map the old admin value to the `role_admin` role with `OIDC_ROLE_MAPPINGS`. For example, a 1.x setup with `OIDC_ADMIN_CLAIM: groups` and `OIDC_ADMIN_VALUE: arcane-admins` becomes:

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

<Link href="/docs/access/roles#oidc-group-mappings">OIDC group mappings</Link> covers multiple groups, environment-scoped roles, mapping from a file, and managing mappings in the UI.

## 4. Review API keys and automation

- Existing API keys are backfilled with a snapshot of their owner's permissions at upgrade time. Later changes to the owner's roles don't update the key.
- Recreate or edit CI/CD keys so they only have the permissions they need.
- API keys created through the API or CLI must include explicit permission grants.
- Update scripts that use removed user role payloads, dashboard action-items, `arcane alerts`, public event creation, or Apprise commands.
- Scripts that read user roles from `GET /users` must use `roleAssignments` and `isGlobalAdmin`; the flat `roles` array is gone.
- Use same-origin or trusted-origin browser calls, or Bearer/API-key auth, for state-changing API requests.

API key create and update payloads look like this:

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

Use environment-scoped grants for automation that only touches one Docker environment. Omit `environmentId` only for permissions that should apply everywhere.

For CI/CD, consider short-lived credentials from <Link href="/docs/access/federated-credentials">Federated Credentials</Link> instead of long-lived API keys.

## 5. Remove deleted settings and integrations

- Move Apprise notifications to a supported provider.
- Stop relying on the removed scheduled prune settings: `dockerPruneMode`, `scheduledPruneContainers`, `scheduledPruneImages`, `scheduledPruneVolumes`, `scheduledPruneNetworks`, and `scheduledPruneBuildCache`.
- Stop relying on the removed OIDC setting `authOidcConfig`.
- Review the interval on each GitOps sync, since the global `gitopsSyncInterval` setting is gone.

## 6. Check custom icons

Absolute `http://` and `https://` icon URLs keep working. Any other icon value is treated as an icon catalog slug.

In Compose metadata or container labels, use:

- `x-arcane.icon-light` and `x-arcane.icon-dark`
- `com.getarcaneapp.arcane.icon-light` and `com.getarcaneapp.arcane.icon-dark`

See <Link href="/docs/reference/compose-labels">Compose Labels</Link>.

## 7. Update remote environments

- Re-pair remote agents that still use bootstrap-token pairing.
- If you use Edge mTLS, upgrade to a current 1.x release first so the generated CA private keys are already encrypted.

## 8. Update the image and runtime settings

- Change the image to `ghcr.io/getarcaneapp/manager:v2`.
- Set `APP_URL` to the exact URL your browser uses to reach Arcane (scheme, host, and port). Arcane 2.0 blocks cookie-authenticated cross-origin writes, so a missing or mismatched `APP_URL` causes `403 Cross-origin request blocked` errors in the UI. Behind a reverse proxy, also configure <Link href="/docs/networking/reverse-proxy#trust-the-proxy-with-trusted_proxies">trusted proxies</Link>.
- Remove `JWT_SECRET`. Arcane signs session tokens with an ML-DSA-87 key that it generates and stores itself, and logs a warning at startup if `JWT_SECRET` is still set.
- Stop relying on the Arcane container writing files as root. Check that Arcane can write to `/app/data`, your projects directory, `/builds`, and `/backups`.
- Set `PUID` and `PGID` only if bind-mounted host files need a specific host owner.
- If you use a Docker socket proxy, keep `DOCKER_HOST` set and make sure the proxy allows the Docker API calls Arcane needs. See <Link href="/docs/security/socket-proxy">Socket Proxy</Link>.

For a Compose install, the result usually looks like this:

```yaml
services:
  arcane:
    image: ghcr.io/getarcaneapp/manager:v2
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - arcane-data:/app/data
      - /opt/docker:/opt/docker
    environment:
      APP_URL: http://localhost:3552
      ENCRYPTION_KEY: your-existing-encryption-key
      PROJECTS_DIRECTORY: /opt/docker
      PUID: '1000'
      PGID: '1000'
```

Keep your existing projects mount. <Link href="/docs/get-started/installation">Installation</Link> explains how Arcane maps the projects folder between the container and the host.

## 9. Upgrade

1. Stop Arcane:

   ```bash
   docker compose down
   ```

2. Take the backups from step 1 if you haven't already.
3. Change the image in your Compose file to `ghcr.io/getarcaneapp/manager:v2`.
4. Start Arcane:

   ```bash
   docker compose up -d
   ```

5. Watch the logs while the database migration runs:

   ```bash
   docker compose logs -f arcane
   ```

6. Open <Link href="http://localhost:3552">http://localhost:3552</Link> and check that:
   - users can sign in
   - the UI saves changes without "Cross-origin request blocked" errors (`APP_URL` is correct)
   - at least one user is a global Admin
   - non-admin users have the right roles
   - OIDC group mappings work, if you use them
   - API keys and scripts have the permissions they need
   - projects and GitOps sync intervals load correctly
   - Activity Center records long-running actions
   - notifications use supported providers
   - remote environments connect
   - Arcane can write to the mounted data, projects, builds, and backup paths

## Roll back

Stop Arcane, restore the database and `/app/data` backup from before the upgrade, then start your previous 1.x image tag. Don't start a 1.x container against a database that 2.0 has already migrated. To go back between 2.x releases, see <Link href="/docs/get-started/downgrading">Downgrading</Link>.
