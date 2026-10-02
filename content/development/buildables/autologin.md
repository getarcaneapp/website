---
title: 'Autologin'
description: 'A build-time feature that signs in automatically with credentials set at runtime.'
---

<script lang="ts">
import { Link } from '#lib/components/ui/link/index.js';
</script>

The **autologin** buildable signs you in automatically, so the login screen is skipped. It's compiled in at build time, and the account it signs in with comes from environment variables at runtime. Use it for local development, CI, or demos.

> [!CAUTION]
> Never expose an autologin build to the internet or any untrusted network. Anyone who can reach it is signed in as that account. Arcane logs a warning at startup when autologin is enabled.

## Enable autologin

1. Build Arcane with the `buildables` tag and `autologin` in `EnabledFeatures`. See <Link href="/docs/development/buildables">Buildables</Link>.
2. Set the credentials of an existing local user on the container:

```yaml
environment:
  - AUTO_LOGIN_USERNAME=arcane
  - AUTO_LOGIN_PASSWORD=arcane-admin
```

When the frontend loads, Arcane signs in with these credentials. Autologin turns itself off if local authentication is disabled.

## Reference

| Variable              | Default        | Description                                                                                                  |
| --------------------- | -------------- | ------------------------------------------------------------------------------------------------------------ |
| `AUTO_LOGIN_USERNAME` | `arcane`       | Username to sign in as.                                                                                      |
| `AUTO_LOGIN_PASSWORD` | `arcane-admin` | Password for that user. Supports `AUTO_LOGIN_PASSWORD_FILE` to read it from a file, such as a Docker secret. |
