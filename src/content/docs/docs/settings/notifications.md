---
title: 'Notifications'
description: 'Send alerts about image updates, container events, prunes, and vulnerabilities to chat, email, or webhooks.'
---

Arcane can notify you when it finds an image update, updates a container, finishes a scheduled prune, finds a fixable vulnerability, or auto-heals an unhealthy container. It delivers these to email (SMTP), Discord, Telegram, Signal, Slack, Ntfy, Pushover, Gotify, Matrix, Google Chat, or any HTTP endpoint through the **Generic** webhook provider. Delivery uses the [Shoutrrr](https://github.com/nicholas-fedor/shoutrrr) library.

## Set up a provider

1. Go to **Settings → Notifications** and open the tab for your provider.
2. Fill in the provider's settings. See [Provider-specific fields](#provider-specific-fields) for the ones that need care.
3. Pick the events you want this provider to receive. Each provider has its own event selection, so you can send different alerts to chat, email, or a webhook.
4. Select **Test** to send a test notification.

If **Test** fails, check that the provider details are correct, that the destination still exists and is reachable, and whether Arcane's logs show a more specific error.

To get notifications on your phone, use the **Mobile Push** tab. See [Arcane Mobile](/docs/settings/mobile-app) for pairing devices and choosing events.

If your service isn't listed, use **Generic**, a plain HTTP webhook whose body you shape yourself. If Shoutrrr supports the service, you can also ask for it to be added to Arcane.

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
