---
title: 'OIDC Single Sign-On'
description: 'Configure OIDC authentication for secure single sign-on access to Arcane.'
---

<script lang="ts">
import * as Code from '$lib/components/ui/code/index.js';
import OidcTable from '$lib/components/oidc-table.svelte';
import * as Alert from '$lib/components/ui/alert/index.js';
import InfoIcon from '@lucide/svelte/icons/info';
import AlertTriangleIcon from '@lucide/svelte/icons/alert-triangle';
</script>

# Single Sign-On (OIDC)

Arcane supports both local user management and Single Sign-On (OIDC) for flexible, secure access control.

## PKCE Requirement

<Alert.Root variant="warning">
<AlertTriangleIcon class="size-4" />
<Alert.Title>PKCE Required</Alert.Title>
<Alert.Description>Arcane requires the use of PKCE for OIDC Authentication.</Alert.Description>
</Alert.Root>

## Recommended: Configure OIDC in the UI

The easiest way to set up OIDC is through Arcane's web interface:

1. Go to **Settings → Authentication** in Arcane
2. Enter your OIDC provider details (Issuer URL, Client ID, Client Secret, Redirect URI, etc)
3. Save and test the connection
4. The UI will guide you through any missing or invalid fields

OIDC users are auto-provisioned on first login. You can disable local login for stricter security.

## Alternative: Environment Variables

You can also configure OIDC using environment variables:

<OidcTable />

### Example docker-compose

```yaml
services:
  arcane:
    # ... image, ports, volumes ...
    environment:
      # ....
      - OIDC_ENABLED=true
      - OIDC_CLIENT_ID=your_arcane_client_id_from_provider
      - OIDC_CLIENT_SECRET=your_super_secret_client_secret_from_provider
      - OIDC_REDIRECT_URI=http://your-arcane-address/auth/oidc/callback
      - OIDC_AUTHORIZATION_ENDPOINT=https://your-provider.com/oauth2/authorize
      - OIDC_TOKEN_ENDPOINT=https://your-provider.com/oauth2/token
      - OIDC_USERINFO_ENDPOINT=https://your-provider.com/oauth2/userinfo
      - OIDC_SCOPES=openid email profile
```

**Note:** Environment variables always override UI settings. The Redirect URI in Arcane and your OIDC provider must match exactly.

## Troubleshooting

For troubleshooting, check both your OIDC provider and Arcane logs for errors.
