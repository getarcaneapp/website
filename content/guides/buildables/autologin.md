---
title: 'Autologin'
description: 'Automatically sign in using build-time credentials'
---

<script lang="ts">
import { Snippet } from '#lib/components/ui/snippet/index.js';
import { Link } from '#lib/components/ui/link/index.js';
</script>

The **autologin** buildable signs in with credentials you provide at runtime. Use it in local development, CI, or demo environments where you need to skip the login screen.

> [!CAUTION]
> Autologin is intended for controlled environments only. **Do not use this in production** or any public-facing deployment.

## Requirements

- Build with the `buildables` tag.
- Enable the `autologin` feature in `buildables.EnabledFeatures`.
- Provide credentials at runtime via environment variables.

If you haven't enabled buildables yet, see the main <Link href="/docs/guides/buildables">Buildables guide</Link>.

## Runtime configuration

Set the following environment variables at runtime:

<Snippet class="mt-2" text="AUTO_LOGIN_USERNAME=your-admin-user" />
<Snippet class="mt-2" text="AUTO_LOGIN_PASSWORD=your-admin-password" />

## Behavior

At startup, Arcane tries the credentials you provided. If authentication succeeds, it skips the login screen.
