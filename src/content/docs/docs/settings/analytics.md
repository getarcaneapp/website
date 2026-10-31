---
title: 'Analytics'
description: 'See what Arcane sends in its analytics heartbeat and how to turn it off.'
---

To turn analytics off, set `ARCANE_ANALYTICS_ENABLED=false` in Arcane's environment and recreate the container. Otherwise Arcane sends a small heartbeat to `https://checkin.getarcane.app/heartbeat` so the project can count running instances and their versions.

## What is sent

The payload contains only these fields:

```json
{
	"version": "unknown",
	"instance_id": "5bd274b3-7500-74b3-aa06-59308f0a0eb2",
	"server_type": "manager"
}
```

- `version`: the Arcane build version, such as `1.2.3`.
- `instance_id`: a random UUID stored in settings, not tied to a user.
- `server_type`: `manager` or `agent`, depending on the server's mode.

No user identifiers, project metadata, secrets, tokens, or environment variables are sent. Your IP address is visible only as part of the normal HTTP request.

## Check the heartbeat in the logs

A successful heartbeat logs this line. A failed one is retried about an hour later.

```
Jan 31 21:10:26.504 INF analytics heartbeat sent successfully version=unknown instanceId=5bd274b3-7500-74b3-aa06-59308f0a0eb2 serverType=manager
```

> [!NOTE]
> If you want to send analytics but the check-in is blocked, disable ad blockers or privacy extensions for a while. Allowlist `checkin.getarcane.app`, and your Arcane domain if you use a proxy.
> Try another network or DNS filter to rule out upstream blocking, and check the Arcane logs for `analytics heartbeat` messages.
