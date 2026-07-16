---
title: 'OIDC Single Sign-On'
description: 'Configure OIDC authentication for secure single sign-on access to Arcane.'
order: 3
---

<script lang="ts">
import * as Code from '$lib/components/ui/code/index.js';
import OidcTable from '$lib/components/oidc-table.svelte';
import * as Alert from '$lib/components/ui/alert/index.js';
import InfoIcon from 'virtual:icons/lucide/info';
import { Link } from '$lib/components/ui/link/index.js';
</script>

## Configure OIDC in the UI

The easiest way to set up OIDC is through Arcane's web interface:

1. Go to **Settings → Security → OIDC Authentication** in Arcane
2. Enter your OIDC provider details
3. Save and test the connection
4. The UI will guide you through any missing or invalid fields

OIDC users are created automatically the first time they sign in. You can disable local login if you want stricter security.

Arcane finds the OIDC endpoints automatically from the issuer URL and its `.well-known/openid-configuration` page. Make sure the issuer URL does not end with a trailing slash.

## Alternative: Environment Variables

You can also configure OIDC using environment variables:

<OidcTable />

## Mapping OIDC Groups to Roles

Role assignment is driven from your IdP. Arcane reads the user's group claim on every login and grants role assignments based on the mappings you configure under **Settings → OIDC Mappings**.

1. Make sure the group claim is included in `OIDC_SCOPES` — for group membership, add `groups`: `openid email profile groups`.
2. Set the **OIDC Groups Claim** under **Settings → Settings** if your IdP uses something other than `groups` (e.g. `realm_access.roles` for Keycloak, `memberOf` for Azure AD).
3. Add mappings under **Settings → OIDC Mappings**, each binding a claim value to a role and an environment scope (Global or a specific environment).

See <Link href="/docs/security/rbac">Role-Based Access Control</Link> for the full role catalog and mapping details.

## Declarative role mappings (IaC)

Instead of the UI, you can declare OIDC group → role mappings with the `OIDC_ROLE_MAPPINGS` environment variable. It takes a JSON array, where each entry binds a claim value to a role and (optionally) an environment:

```json
[
	{ "claimValue": "arcane-admins", "roleId": "role_admin" },
	{ "claimValue": "arcane-devops", "roleId": "role_editor", "environmentId": "env-prod" }
]
```

- `claimValue` — the value to match in the user's groups claim.
- `roleId` — the role to grant (see <Link href="/docs/security/rbac">Role-Based Access Control</Link> for the role catalog).
- `environmentId` — optional; scope the assignment to one environment. Omit for a global assignment.

Arcane reconciles these mappings on every startup, so they are read-only in the UI (shown as environment-managed); update them by changing `OIDC_ROLE_MAPPINGS`. The variable also supports the `_FILE` suffix for Docker secrets.

## Example Compose Configuration

```yaml
services:
  arcane:
    # ... image, ports, volumes ...
    environment:
      # ....
      - OIDC_ENABLED=true
      - OIDC_CLIENT_ID="your_arcane_client_id_from_provider"
      - OIDC_CLIENT_SECRET="your_super_secret_client_secret_from_provider"
      - OIDC_ISSUER_URL="https://auth.example.com"
      - OIDC_SCOPES=openid email profile groups
      - OIDC_GROUPS_CLAIM=groups
```
