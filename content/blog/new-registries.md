---
title: 'New registries for Arcane'
description: 'Official image references for the Arcane manager and agent.'
date: 2026-08-25
kind: update
featured: true
banner: 'Container images are now available on Docker Hub and Quay.io!'
---

<script lang="ts">
import { Snippet } from '#lib/components/ui/snippet/index.js';
</script>

If you prefer not to rely on GitHub alone, Arcane 2.9.0 supports pulling the official images from either registry below.

## Quay.io

<Snippet text="quay.io/getarcaneapp/manager" class="mt-2" />
<Snippet text="quay.io/getarcaneapp/agent" class="mt-2" />

## Docker Hub

<Snippet text="getarcaneapp/manager" class="mt-2" />
<Snippet text="getarcaneapp/agent" class="mt-2" />

The tags remain the same across each registry, so you can switch registries without changing the version you deploy.

We also plan to publish the images to AWS. The custom registry URL is still being worked out, but we will share more details when that is ready.

Thank you all again for your continued support of Arcane. Seeing the success stories from the community keeps us motivated.
