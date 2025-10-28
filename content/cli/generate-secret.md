---
title: 'arcane generate secret'
description: 'Generate secure cryptographic secrets for ENCRYPTION_KEY and JWT_SECRET.'
---

<script lang="ts">
import CliCommand from '$lib/components/cli-command.svelte';
import { ARCANE_COMMANDS } from '$lib/config/cli-commands.js';
</script>

<CliCommand command={ARCANE_COMMANDS.secret} />
