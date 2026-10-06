---
title: 'Analytics'
description: 'See what Arcane sends in its analytics heartbeat and how to turn it off.'
---

Arcane sends a small heartbeat to `https://checkin.getarcane.app/heartbeat` so the project can count running instances and their versions. To turn it off, set `ANALYTICS_DISABLED=true` in Arcane's environment and recreate the container.

## What is sent

The payload contains only:

```json
{
	"version": "unknown",
	"instance_id": "5bd274b3-7500-74b3-aa06-59308f0a0eb2",
	"server_type": "manager"
}
```

- `version`: the Arcane build version, such as `1.2.3`.
- `instance_id`: a randomly generated UUID stored in settings. It isn't tied to a user.
- `server_type`: `manager` or `agent`, depending on the server's mode.

Arcane doesn't send user identifiers, project metadata, secrets, tokens, or environment variables. Your IP address is visible only as part of the normal HTTP request.

## Check the heartbeat in the logs

A successful heartbeat log looks like this:

```
Jan 31 21:10:26.504 INF analytics heartbeat sent successfully jobName=analytics-heartbeat version=unknown instanceID=5bd274b3-7500-74b3-aa06-59308f0a0eb2 serverType=manager heartbeatURL=http://localhost:8080/heartbeat env=development
```

Only `version`, `instanceID`, and `serverType` are sent. The other fields (`jobName`, `heartbeatURL`, `env`) are local context.

> [!NOTE]
> If you want to send analytics but the check-in is blocked:
>
> - Temporarily disable ad blockers or privacy extensions.
> - Allowlist `checkin.getarcane.app`, and your Arcane domain if you use a proxy.
> - Try a different network or DNS filter to rule out upstream blocking.
> - Check the Arcane logs for `analytics heartbeat` messages.
