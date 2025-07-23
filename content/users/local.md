---
title: 'Local Users'
description: 'Learn how to manage local users in Arcane, including the default admin user and creating new users.'
---

<script lang="ts">
import * as Alert from '$lib/components/ui/alert/index.js';
import { Snippet } from '$lib/components/ui/snippet/index.js';
import InfoIcon from '@lucide/svelte/icons/info';
import { Link } from '$lib/components/ui/link/index.js';
</script>

## Default Admin User

<Alert.Root class="mt-4">
<InfoIcon class="size-4" />
<Alert.Title>Default Admin User</Alert.Title>
<Alert.Description>
On first run, Arcane creates a default admin user if no users exist. You must change this password during onboarding.
</Alert.Description>
</Alert.Root>

**Username:**
<Snippet text="arcane" class="mt-2 max-w-[300px]" />

**Password:**
<Snippet text="arcane-admin" class="mt-2 max-w-[300px]" />

## Creating New Users

To add users:

1. Go to **Settings → User Management**
2. Click **Create User**
3. Fill in username, display name, email, and password

> For more secure authentication, consider using <Link href='/docs/users/sso'>OIDC Single Sign-On</Link> instead of local users.
