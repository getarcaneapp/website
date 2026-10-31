---
title: 'Notifications'
description: 'Send alerts about image updates, container events, prunes, and vulnerabilities to chat, email, or webhooks.'
---

Get alerts when Arcane finds an image update, updates a container, finishes a scheduled prune, finds a fixable vulnerability, or auto-heals a container. Arcane sends them via [Shoutrrr](https://github.com/nicholas-fedor/shoutrrr) to email (SMTP), Discord, Telegram, Signal, Slack, Ntfy, Pushover, Gotify, Matrix, Google Chat, or any HTTP endpoint (the **Generic** webhook provider).

## Set up a provider

Providers are set once on the Manager and cover every environment. Managing them needs `notifications:manage`.

1. Open **System → Notifications** and choose your provider.
2. Fill in the provider's settings. See [Provider-specific fields](#provider-specific-fields) for the ones that need care.
3. Pick the events this provider receives. Each provider has its own selection, so chat, email, and webhooks can get different alerts.
4. Select **Test** to send a test notification. If it fails, check the provider details, that the destination exists and is reachable, and Arcane's logs.

For phone alerts, turn on mobile push on the same page; see [Arcane Mobile](/docs/settings/mobile-app). If your service isn't listed, use **Generic**, a plain HTTP webhook whose body you shape. If Shoutrrr supports the service, you can also ask for it to be added.

## Custom webhook payloads

Use **Payload Template** when your endpoint needs nested objects, specific field names, or a non-JSON body; **Generic** otherwise sends a flat JSON body. Templates use Go [`text/template`](https://pkg.go.dev/text/template) syntax with these variables:

| Variable             | Value                                        |
| -------------------- | -------------------------------------------- |
| `{{.title}}`         | The notification title.                      |
| `{{.message}}`       | The notification body.                       |
| `{{.environment}}`   | Name of the environment the event came from. |
| `{{.environmentId}}` | ID of that environment.                      |
| `{{.event}}`         | The event type, e.g. `image_update`.         |
| `{{.timestamp}}`     | When the event fired, RFC 3339 in UTC.       |

A minimal template for a single `text` field. Arcane escapes quotes and newlines in values; add the surrounding JSON quotes yourself.

```json
{ "text": "{{.message}}" }
```

> [!NOTE]
> `{{.title}}` and `{{.message}}` follow the provider's **Title Key** and **Message Key** fields. Rename those and the variables change too.

Templates must parse and execute, and for JSON content types produce valid JSON. Otherwise saving fails with `invalid generic webhook payload template`. A template defaults the content type to `application/json`. Use **Test** to check the rendered payload.

## Success body matching

If an endpoint returns `HTTP 200` even on failure, set **Success Body Contains** to text that confirms delivery, such as `"code":200`. Arcane then requires it in the response body, also with **Payload Template**.

## Reference

### Notification events

| Event                                   | Sent when                                                    |
| --------------------------------------- | ------------------------------------------------------------ |
| **Image Update Detected**               | Arcane finds a newer version of an image.                    |
| **Container Updated**                   | A container has been updated or restarted successfully.      |
| **System Prune Report**                 | A scheduled prune finishes. The message is a summary.        |
| **Vulnerability Found (Fix Available)** | A scan finds a vulnerability with a fixed version available. |
| **Auto-Heal Restart**                   | Arcane automatically restarts an unhealthy container.        |

### Provider-specific fields

| Provider     | What to know                                                                                                                 |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| Ntfy         | For token authentication, leave **Username** empty and put the token in **Password or token**. For a password, fill in both. |
| Matrix       | **Password or token** is required. Leave **Username** empty when using a token.                                              |
| Google Chat  | Copy the space's webhook URL from **Apps & integrations → Webhooks**. Messages are plain text with the title in the body.    |
| Email (SMTP) | **From Address** accepts a bare address or one with a display name, such as `Arcane <notifications@example.com>`.            |
