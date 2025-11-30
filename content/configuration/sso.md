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

OIDC users are auto-provisioned on first login. You can disable local login for stricter security.

All the OIDC Urls are discovered from the issuer url/the providers `.well-known/openid-configuration` endpoint. Make sure there is no trailing slash on the Issuer URL.

## Alternative: Environment Variables

You can also configure OIDC using environment variables:

> **Note:** Environment variables always override UI settings. If the settings are configured from the Environment then removed from the environment, the values still stay in the database and OIDC is still configured, unless turned off via the UI. 

<OidcTable />

## Admin Role Assignment

The `OIDC_ADMIN_CLAIM` and `OIDC_ADMIN_VALUE` settings allow you to automatically grant admin privileges to users based on their OIDC token claims.

- **OIDC_ADMIN_CLAIM**: The claim in the OIDC token to check (e.g., `groups`, `roles`, or a custom claim)
- **OIDC_ADMIN_VALUE**: The value(s) that grant admin access. Use commas to specify multiple values (e.g., `arcane-admins,super-users`)

When a user logs in, Arcane checks if their token contains the specified claim with a matching value. If it does, they're granted admin access.

> **Important:** The claim you want to use (e.g., `groups`) must be included in your `OIDC_SCOPES`. For example, if you want to use group membership for admin assignment, make sure `groups` is in your scopes: `openid email profile groups`

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
      - OIDC_ADMIN_CLIAM=groups
      - OIDC_ADMIN_VALUE=_arcane_admins
      - OIDC_MERGE_ACCOUNTS=true
```


