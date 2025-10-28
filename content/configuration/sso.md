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

## Recommended: Configure OIDC in the UI

The easiest way to set up OIDC is through Arcane's web interface:

1. Go to **Settings → Authentication** in Arcane
2. Enter your OIDC provider details (Issuer URL, Client ID, Client Secret, Redirect URI, etc)
3. Save and test the connection
4. The UI will guide you through any missing or invalid fields

OIDC users are auto-provisioned on first login. You can disable local login for stricter security.

All the OIDC Urls are discovered from the issuer url/the providers `.well-known/openid-configuration` endpoint. Make sure there is no trailing slash on the Issuer URL.

## Alternative: Environment Variables

You can also configure OIDC using environment variables:

<OidcTable />

## Example docker-compose

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
      - OIDC_SCOPES=openid email profile
```

> **Note:** Environment variables always override UI settings. If the settings are configured from the Environment then removed from the environment, the values still stay in the database and OIDC is still configured, unless turned off via the UI. 

## Troubleshooting

For troubleshooting, check both your OIDC provider and Arcane logs for errors.
