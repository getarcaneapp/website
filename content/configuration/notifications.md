---
title: 'Notifications'
description: 'Configure notifications for container image updates and container events.'
---

Arcane sends notifications through [Shoutrrr](https://github.com/nicholas-fedor/shoutrrr).

## How setup works

1. Go to **Settings → Notifications** in the Arcane UI
2. Choose a provider
3. Fill in the settings for that provider
4. Pick the events you want to receive
5. Use the **Test** button to make sure everything works

## Testing notifications

If **Test** fails, check:

- that the provider details are correct
- that the destination service still exists and is reachable
- that Arcane logs do not show a more specific error

## Supported providers

Supported providers include Discord, email (SMTP), Slack, Telegram, Matrix, Gotify, Pushover, Ntfy, Microsoft Teams, and Google Chat.

For Google Chat, copy the space's webhook URL from **Apps & integrations → Webhooks**. Messages are plain text, with the title included in the body.

If your destination is not one of the named providers, use **Generic** — a plain HTTP webhook whose body you shape yourself. See [Custom webhook payloads](#custom-webhook-payloads).

The email (SMTP) provider's **From Address** accepts a bare address or one with a display name, such as `Arcane <notifications@example.com>`.

## Notification event types

- **Image Update Detected** — when Arcane finds a newer version of an image
- **Container Updated** — when a container has been updated or restarted successfully
- **System Prune Report** — when a scheduled prune finishes and Arcane sends a summary
- **Vulnerability Found (Fix Available)** — when a scan finds a vulnerability with a fixed version available
- **Auto-Heal Restart** — when Arcane automatically restarts an unhealthy container

## Event selection

Each provider has its own event selection, so you can send different alerts to chat, email, or a webhook.

## Mobile push notifications

The **Mobile Push** tab in **Settings → Notifications** delivers native push notifications to the [Arcane Mobile](/docs/guides/arcane-mobile) iOS app.

1. Turn on **Mobile push notifications** (requires the `settings:write` permission).
2. In the Arcane mobile app, open its settings and enable push notifications to pair your device.
3. Paired devices appear under **Your mobile devices**, where you can send a test notification to a device or remove it.

Each device picks its own events and environments from the app, so two phones connected to the same server can subscribe to different alerts.

Notification titles and messages are delivered through Arcane's hosted push relay (`apns.getarcane.app`) and Apple's push servers. Your server address, users, and credentials are never sent.

## Custom webhook payloads

The **Generic** provider sends a flat JSON body by default. Use **Payload Template** if your endpoint needs nested objects, specific field names, or a non-JSON body.

The template is Go [`text/template`](https://pkg.go.dev/text/template) syntax. These variables are available:

| Variable             | Value                                        |
| -------------------- | -------------------------------------------- |
| `{{.title}}`         | The notification title.                      |
| `{{.message}}`       | The notification body.                       |
| `{{.environment}}`   | Name of the environment the event came from. |
| `{{.environmentId}}` | ID of that environment.                      |
| `{{.event}}`         | The event type, e.g. `image_update`.         |
| `{{.timestamp}}`     | When the event fired, RFC 3339 in UTC.       |

A minimal template for an endpoint that wants a single `text` field:

```json
{ "text": "{{.message}}" }
```

Arcane escapes quotes and newlines in values. Add the surrounding JSON quotes yourself, as above.

> [!NOTE]
> `{{.title}}` and `{{.message}}` follow the provider's **Title Key** and **Message Key** fields. Rename those and the template variables are renamed with them.

Templates must parse and execute. For JSON content types, their output must also be valid JSON. Otherwise, saving fails with `invalid generic webhook payload template`. A template defaults the content type to `application/json`.

Use **Test** to check the rendered payload.

## Success body matching

If an endpoint returns `HTTP 200` even on failure, set **Success Body Contains** to text that confirms delivery, such as `"code":200`. Arcane then requires that text in the response body. This also works with **Payload Template**.

## Missing a provider?

If a provider is not listed in Arcane but **is supported by** [Shoutrrr](https://github.com/nicholas-fedor/shoutrrr), we can add it.
