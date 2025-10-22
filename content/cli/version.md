---
title: 'arcane version'
description: 'Print Arcane version information.'
---

<script lang="ts">
import CliCommand from '$lib/components/cli-command.svelte';
import { ARCANE_COMMANDS } from '$lib/config/cli-commands.js';
</script>

<CliCommand command={ARCANE_COMMANDS.version} />
