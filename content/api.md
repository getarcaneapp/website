---
title: API Reference
description: Complete reference for all Pocket ID API endpoints
---

<script lang="ts">
import ApiViewer from '$lib/components/api-viewer.svelte';
</script>

## Generating a API Key

1. Navigate to https://arcane.example.com/settings/api-keys
2. Click `Add API Key`
3. Enter a `Name` for the new API Key
4. Select a `Expires At` Date, (Leave Blank for now expiration)
5. Enter a `Description` for the new API Key
6. Click `Create Api Key`

> [!IMPORTANT]
> Make sure you copy the API Key from the Dialog window it will not be shown again!

## Endpoints

> [!IMPORTANT]
> All endpoints should have the `X-API-TOKEN` header with the content being the API Key when sending a request.

<br />

<ApiViewer src="/apiref/swagger.yaml" />