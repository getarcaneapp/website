---
title: 'arcane generate'
description: 'Generate secrets for Arcanes backend.'
---

<script lang="ts">
import CliCommand from '$lib/components/cli-command.svelte';
import { ARCANE_COMMANDS } from '$lib/config/cli-commands.js';
</script>

<CliCommand command={ARCANE_COMMANDS.generate} />
