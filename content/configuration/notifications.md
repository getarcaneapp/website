---
title: 'Notifications'
description: 'Configure Discord and email notifications for container image updates.'
order: 1
---

Arcane supports automated notifications to keep you informed when container image updates are available or when containers are successfully updated. Currently, Discord and email notifications are supported.

## Notification Types

Arcane can send notifications for two types of events:

- **Image Update Available** - When a newer version of a container image is detected
- **Container Updated** - When a container has been successfully updated to a new image version

## Discord Notifications

Discord notifications are delivered via webhooks, making setup quick and straightforward.

### Setup

1. Navigate to **Settings → Notifications** in the Arcane UI
2. Select **Discord** as the notification provider
3. Configure your Discord webhook settings

### Discord Configuration

| Field | Required | Description |
|-------|----------|-------------|
| **Webhook URL** | Yes | The Discord webhook URL for your channel |
| **Username** | No | Custom username for the bot (defaults to "Arcane") |
| **Avatar URL** | No | Custom avatar URL for the bot |
| **Enabled Events** | No | Choose which events trigger notifications |

### Creating a Discord Webhook

To create a Discord webhook, follow Discord's official guide: [Intro to Webhooks](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks)

Once you have your webhook URL, paste it into Arcane's Discord notification settings.

## Email Notifications

Email notifications provide detailed information about container updates and support both HTML and plain text formats.

### Setup

1. Navigate to **Settings → Notifications** in the Arcane UI
2. Select **Email** as the notification provider
3. Configure your SMTP server settings

### Email Configuration

| Field | Required | Description |
|-------|----------|-------------|
| **SMTP Host** | Yes | Your SMTP server hostname (e.g., `smtp.gmail.com`) |
| **SMTP Port** | Yes | SMTP server port (typically 587 for STARTTLS, 465 for SSL) |
| **SMTP Username** | Yes | Username for SMTP authentication |
| **SMTP Password** | Yes | Password for SMTP authentication (stored encrypted) |
| **From Address** | Yes | Email address notifications are sent from |
| **To Addresses** | Yes | Comma-separated list of recipient email addresses |
| **TLS Mode** | Yes | Encryption mode: `none`, `starttls`, or `ssl` |
| **Enabled Events** | No | Choose which events trigger notifications |

> [!NOTE] Email addresses must be in the format `example@example.com`

### TLS Modes

- **None** - No encryption (not recommended for production)
- **STARTTLS** - Upgrades connection to TLS after initial connection (port 587)
- **SSL/TLS** - Direct TLS connection from the start (port 465)

## Event Configuration

Both Discord and email notifications allow you to choose which events trigger notifications:

### Available Events

- **Image Update Available** - Triggered when Arcane detects a newer image version is available
- **Container Updated** - Triggered after a container has been successfully updated

You can enable or disable each event type independently for each notification provider. This allows you to:

- Send update availability notifications to Discord for quick awareness
- Send successful update confirmations via email for record-keeping
- Configure different notification preferences for different channels


## Testing Notifications

After configuring a notification provider, use the **Test** button in the Arcane UI to verify your settings:

1. Configure your notification settings
2. Click the **Test** button
3. Check your Discord channel or email inbox for the test notification

If the test fails, check:
- Discord: Verify the webhook URL is correct and the webhook hasn't been deleted
- Email: Verify SMTP credentials, port, and TLS settings are correct
- Both: Check Arcane logs for detailed error messages


## Future Notification Providers

Arcane's notification system is designed to be extensible. Additional providers may be added in future releases based on community feedback.
