---
title: 'Autologin'
description: 'A build-time feature that signs in automatically with credentials set at runtime.'
---

The **autologin** buildable skips the login screen and signs you in as a set account. Use it for local development, CI, or demos.

> [!CAUTION]
> Never expose an autologin build to the internet or any untrusted network. Anyone who can reach it is signed in as that account. Arcane logs a warning at startup when autologin is enabled.

## Enable autologin

1. Build Arcane with the `buildables` tag and `autologin` in `EnabledFeatures`. See [Buildables](/docs/development/buildables).
2. Set the credentials of an existing local user on the container:

   ```yaml
   environment:
     - ARCANE_AUTO_LOGIN_USERNAME=arcane
     - ARCANE_AUTO_LOGIN_PASSWORD=arcane-admin
   ```

3. Open Arcane. It signs in with these credentials when the frontend loads.

Autologin turns itself off if local authentication is disabled.

## Reference

| Variable | Default | Description |
| --- | --- | --- |
| `ARCANE_AUTO_LOGIN_USERNAME` | `arcane` | Username to sign in as. |
| `ARCANE_AUTO_LOGIN_PASSWORD` | `arcane-admin` | Password for that user. `ARCANE_AUTO_LOGIN_PASSWORD_FILE` reads it from a file. |
