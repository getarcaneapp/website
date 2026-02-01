---
title: 'Analytics'
description: 'Analytics Notice for Arcane'
---

The analytics heartbeat is a lightweight check-in used to understand *which servers are running* and *which build/version they are on*. It does **not** collect personal data, user data, or project data.

## What is sent

The heartbeat sends a small JSON payload with **only** the following fields:

```json
{
  "version": "unknown",
  "instance_id": "5bd274b3-7500-74b3-aa06-59308f0a0eb2",
  "server_type": "manager"
}
```

Field meanings:

- `version`: The Arcane build version (e.g., `1.2.3`).
- `instance_id`: A randomly generated UUID stored in settings. It is not tied to a user identity.
- `server_type`: Either `manager` or `agent` based on the server's mode.

## What is *not* sent

- No user identifiers
- No IP addresses (beyond normal HTTP transport)
- No project metadata
- No secrets, tokens, or environment variables

## How to verify in logs

A successful heartbeat log looks like this:

```
Jan 31 21:10:26.504 INF analytics heartbeat sent successfully jobName=analytics-heartbeat version=unknown instanceID=5bd274b3-7500-74b3-aa06-59308f0a0eb2 serverType=manager heartbeatURL=http://localhost:8080/heartbeat env=development
```

The **sent payload fields** are `version`, `instanceID`, and `serverType`. The other log fields (`jobName`, `heartbeatURL`, `env`) are local context only and are **not** part of the payload.

## Environments and endpoints

- **Production**: `https://checkin.getarcane.app/heartbeat`

## Opting out

Set `ANALYTICS_DISABLED=true` to disable heartbeat sending entirely.
