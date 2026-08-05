---
title: 'Notifications'
description: 'Configure notifications for container image updates and container events.'
---

Arcane uses [Shoutrrr](https://github.com/nicholas-fedor/shoutrrr) for notifications. If Shoutrrr supports a provider, Arcane can usually support it too.

## Notification event types

Arcane can send notifications for these events:

- **Image Update Detected** — when Arcane finds a newer version of an image
- **Container Updated** — when a container has been updated or restarted successfully
- **System Prune Report** — when a scheduled prune finishes and Arcane sends a summary
- **Vulnerability Found (Fix Available)** — when a scan finds a vulnerability with a fixed version available
- **Auto-Heal Restart** — when Arcane automatically restarts an unhealthy container

## Supported providers

Arcane includes the most common Shoutrrr providers and can grow with them over time. Common options include Discord, email (SMTP), Slack, Telegram, Matrix, Gotify, Pushover, Ntfy, Microsoft Teams, Google Chat, and more.

You do **not** need a separate setup guide for every provider. In Arcane, you simply pick the provider you want, fill in the fields it asks for, and choose which events should trigger it.

Google Chat asks only for the incoming webhook URL of the space you want to post to — find it in Google Chat under **Apps & integrations → Webhooks**. Google Chat messages are plain text, so Arcane folds the notification title into the message body.

If your destination is not one of the named providers, use **Generic** — a plain HTTP webhook whose body you shape yourself. See [Custom webhook payloads](#custom-webhook-payloads).

## How setup works

1. Go to **Settings → Notifications** in the Arcane UI
2. Choose a provider
3. Fill in the settings for that provider
4. Pick the events you want to receive
5. Use the **Test** button to make sure everything works

The exact fields change depending on the provider you choose. For example, some providers use a webhook URL, while others use SMTP or a token.

## Event selection

You can turn events on or off for each provider separately. That makes it easy to:

- Send quick alerts to chat apps
- Send record-keeping updates by email
- Use different providers for different kinds of alerts

## Custom webhook payloads

The **Generic** provider sends a flat JSON body by default. If your endpoint needs a different shape — a nested object, a field named something specific, a non-JSON body — fill in **Payload Template** and Arcane sends that instead.

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

Every value is JSON-string-escaped before it is substituted, so quotes and newlines in a message will not break the body. You supply the surrounding quotes yourself, as above.

> [!NOTE]
> `{{.title}}` and `{{.message}}` follow the provider's **Title Key** and **Message Key** fields. Rename those and the template variables are renamed with them.

Arcane validates the template when you save: it must parse, it must execute, and if the content type is JSON the rendered result must be valid JSON. A template that fails any of those is rejected with `invalid generic webhook payload template` and nothing is saved. Setting a template also defaults the content type to `application/json`.

The **Test** button renders the template exactly as a real notification would, so use it to confirm the shape before you rely on it.

## Success body matching

Some endpoints answer `HTTP 200` whether or not they accepted the message, and report the real outcome inside the response body. Put the text that marks success — for example `"code":200` — in the Generic provider's **Success Body Contains** field, and Arcane only counts the notification as delivered when the response body contains it.

It works alongside **Payload Template**; one shapes the request, the other judges the response.

## Testing notifications

After setting up a provider, click the **Test** button in the Arcane UI.

If the test fails, check:

- that the provider details are correct
- that the destination service still exists and is reachable
- that Arcane logs do not show a more specific error

## Missing a provider?

If a provider is not listed in Arcane but **is supported by** [Shoutrrr](https://github.com/nicholas-fedor/shoutrrr), we can add it.
