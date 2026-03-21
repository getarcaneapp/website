---
title: 'OIDC Single Sign-On'
description: 'Configure OIDC authentication for secure single sign-on access to Arcane.'
order: 3
---

<script lang="ts">
import * as Code from '$lib/components/ui/code/index.js';
import OidcTable from '$lib/components/oidc-table.svelte';
import * as Alert from '$lib/components/ui/alert/index.js';
import InfoIcon from '@lucide/svelte/icons/info';
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

## Admin Role Assignment

The `OIDC_ADMIN_CLAIM` and `OIDC_ADMIN_VALUE` settings let Arcane make certain users admins based on information in their login token.

- **OIDC_ADMIN_CLAIM**: the part of the login token to check, such as `groups` or `roles`
- **OIDC_ADMIN_VALUE**: the value or values that should grant admin access. Use commas for more than one value, such as `arcane-admins,super-users`

When someone signs in, Arcane checks whether their token contains the matching value. If it does, they become an admin.

> [!IMPORTANT]
> The claim you want to use, such as `groups`, must be included in `OIDC_SCOPES`. For example, if you want group membership to control admin access, make sure your scopes include `groups`: `openid email profile groups`

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
      - OIDC_ADMIN_CLAIM=groups
      - OIDC_ADMIN_VALUE=_arcane_admins
      - OIDC_MERGE_ACCOUNTS=true
```
