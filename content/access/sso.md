---
title: 'OIDC Single Sign-On'
description: 'Let users sign in to Arcane through your OpenID Connect provider.'
---

<script lang="ts">
import OidcTable from '#lib/components/oidc-table.svelte';
import { Link } from '#lib/components/ui/link/index.js';
</script>

OIDC single sign-on lets users sign in to Arcane with an account from your identity provider (Authentik, Keycloak, Pocket ID, Azure AD, and so on) instead of a local password. From the provider you need a client ID, a client secret, and the issuer URL, and you need to register Arcane's redirect URI, `https://<your-arcane-url>/auth/oidc/callback`.

## Configure OIDC in the UI

1. Go to **Settings → Authentication**.
2. Enter your provider's client ID, client secret, and issuer URL. The page shows the redirect URI to copy into your provider.
3. Save and test the connection. The page points out any missing or invalid fields.

Arcane finds the provider's endpoints from the issuer URL and its `.well-known/openid-configuration` page. The issuer URL must not end with a trailing slash.

Arcane creates an OIDC user the first time they sign in. You can disable local login if you want everyone to sign in through your provider.

## Skip the login screen

Turn on **Auto Redirect to Provider** in **Settings → Authentication** (or set `OIDC_AUTO_REDIRECT_TO_PROVIDER=true`) to send users straight to your provider instead of showing Arcane's login page.

If the provider is down or misconfigured, open `https://<your-arcane-url>/login/backup`. This backup login page never redirects, so you can still sign in with a local account or a passkey and fix the OIDC settings.

> [!NOTE]
> The backup login page only shows the password form while local login is enabled. If you disabled it, sign in with a passkey or see <Link href="/docs/access/account-recovery">Account Recovery</Link>.

## Configure OIDC with Compose

You can set the same options with environment variables instead of the UI:

```yaml
services:
  arcane:
    environment:
      - OIDC_ENABLED=true
      - OIDC_CLIENT_ID=your_arcane_client_id_from_provider
      - OIDC_CLIENT_SECRET=your_super_secret_client_secret_from_provider
      - OIDC_ISSUER_URL=https://auth.example.com
      - OIDC_SCOPES=openid email profile groups
      - OIDC_GROUPS_CLAIM=groups
```

In list-form `environment:` entries, don't wrap values in quotes. The quotes become part of the value.

## Map provider groups to roles

Arcane can grant roles based on the groups in a user's OIDC token. Add `groups` to the scopes, set the **OIDC Groups Claim** if your provider uses a different claim name, and add mappings in the UI or with `OIDC_ROLE_MAPPINGS`. See <Link href="/docs/access/roles#oidc-group-mappings">OIDC group mappings</Link> for the setup steps and the JSON format.

## Reference

<OidcTable />
