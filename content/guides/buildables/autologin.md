---
title: 'Autologin'
description: 'Automatically sign in using build-time credentials'
published: false
---

<script lang="ts">
import { Snippet } from '$lib/components/ui/snippet/index.js';
import { Link } from '$lib/components/ui/link/index.js';
</script>

The **autologin** buildable allows Arcane to automatically sign in using credentials you provide at runtime. This is useful for local development, CI, or demo environments where you want to skip the login screen.

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

When enabled, Arcane will attempt to authenticate using the provided credentials during startup and skip the login screen when successful.
