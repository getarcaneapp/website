---
title: 'Notifications'
description: 'Configure notifications for container and image updates.'
---

Arcane supports automated notifications to keep you informed when container image updates are available or when containers are successfully updated.

## Notification Events

Arcane can send notifications for two types of events:

- **Image Update Available** - When a newer version of a container image is detected during scheduled checks
- **Container Updated** - When a container has been successfully updated to a new image version

Each notification provider can be configured independently to subscribe to either or both event types.

## Supported Notification Providers

Arcane leverages [Shoutrrr](https://github.com/nicholas-fedor/shoutrrr) to support a wide range of notification platforms. The list below shows the current status of natively supported providers in the Arcane UI.

### Chat
- [x] [Discord](#discord-notifications)
- [ ] Google Chat
- [ ] Lark
- [ ] Matrix
- [ ] Mattermost
- [ ] Rocketchat
- [x] [Signal](#signal-notifications)
- [x] [Slack](#slack-notifications)
- [ ] Teams
- [x] [Telegram](#telegram-notifications)
- [ ] WeCom
- [ ] Zulip Chat

### Push Services
- [ ] Bark
- [ ] Gotify
- [ ] IFTTT
- [ ] Join
- [x] [Ntfy](#ntfy-notifications)
- [ ] Pushbullet
- [ ] Pushover

### Incident Services
- [ ] OpsGenie
- [ ] PagerDuty

### Email
- [x] [Email](#email-notifications)

### Special
- [x] [Generic Webhook](#generic-webhook-notifications)
- [ ] Logger
- [ ] Notifiarr

> [!TIP]
> Don't see your favorite provider? We can easily add any platform supported by Shoutrrr. Please [open a feature request](https://github.com/getarcaneapp/arcane/issues/new/choose) to let us know.

---

## Discord Notifications

Discord notifications are delivered via webhooks, making setup quick and straightforward.

### Setup

1. Navigate to **Settings → Notifications** in the Arcane UI
2. Select the **Discord** tab
3. Enable Discord notifications and configure webhook settings
4. Click **Save** and use **Test Notification** to verify

### Configuration Fields

| Field | Required | Description |
|-------|----------|-------------|
| **Webhook ID** | Yes | The webhook ID from your Discord webhook URL (after `/webhooks/`) |
| **Webhook Token** | Yes | The token from your Discord webhook URL (second part after webhook ID) |
| **Bot Username** | No | Custom username for the bot (defaults to "Arcane") |
| **Avatar URL** | No | Custom avatar URL for the bot (must be a valid image URL) |

### Creating a Discord Webhook

1. Go to your Discord server settings
2. Navigate to **Integrations → Webhooks**
3. Click **New Webhook** or **Create Webhook**
4. Configure the webhook name and channel
5. Copy the webhook URL (format: `https://discord.com/api/webhooks/WEBHOOK_ID/TOKEN`)
6. Extract the `WEBHOOK_ID` and `TOKEN` from the URL and enter them in Arcane

For detailed instructions, see [Discord's Intro to Webhooks](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks).

---

## Email Notifications

Email notifications provide detailed HTML-formatted information about container updates with support for multiple recipients.

### Setup

1. Navigate to **Settings → Notifications** in the Arcane UI
2. Select the **Email** tab
3. Enable email notifications and configure SMTP settings
4. Click **Save** and use **Test Notification** to verify

### Configuration Fields

| Field | Required | Description |
|-------|----------|-------------|
| **SMTP Host** | Yes | Your SMTP server hostname (e.g., `smtp.gmail.com`) |
| **SMTP Port** | Yes | SMTP server port (typically 587 for STARTTLS, 465 for SSL/TLS) |
| **SMTP Username** | No | Username for SMTP authentication (leave blank if not required) |
| **SMTP Password** | No | Password for SMTP authentication (stored encrypted) |
| **From Address** | Yes | Email address notifications are sent from (must be valid format) |
| **To Addresses** | Yes | Comma-separated list of recipient email addresses |
| **TLS Mode** | Yes | Encryption mode: `none`, `starttls`, or `ssl` |

### TLS Modes

- **None** - No encryption (not recommended for production use)
- **StartTLS** - Upgrades connection to TLS after initial connection (recommended, port 587)
- **SSL/TLS** - Direct TLS connection from the start (port 465)

### Email Providers

Common SMTP configurations:

**Gmail**
- Host: `smtp.gmail.com`
- Port: `587`
- TLS Mode: `starttls`
- Note: Use an [App Password](https://support.google.com/accounts/answer/185833) instead of your regular password

**Outlook/Office 365**
- Host: `smtp.office365.com`
- Port: `587`
- TLS Mode: `starttls`

---

## Generic Webhook Notifications

The Generic Webhook provider allows you to send notifications to any HTTP/HTTPS endpoint, making it compatible with custom webhooks, automation platforms, and any service that accepts HTTP POST requests.

### Setup

1. Navigate to **Settings → Notifications** in the Arcane UI
2. Select the **Generic** tab
3. Enable generic webhook notifications and configure endpoint details
4. Click **Save** and use **Test Notification** to verify

### Configuration Fields

| Field | Required | Description |
|-------|----------|-------------|
| **Webhook URL** | Yes | The full webhook endpoint URL including protocol (http:// or https://) |
| **HTTP Method** | No | HTTP method to use (defaults to `POST`) |
| **Content Type** | No | Content-Type header value (defaults to `application/json`) |
| **Title Key** | No | JSON key name for the notification title (defaults to `title`) |
| **Message Key** | No | JSON key name for the notification message (defaults to `message`) |
| **Custom Headers** | No | Comma-separated list of headers in format `Key:Value` |
| **Disable TLS** | No | Use HTTP instead of HTTPS (not recommended for production) |

### Custom Headers

Custom headers can be used for authentication or other purposes. Format as comma-separated `Key:Value` pairs:

```
Authorization:Bearer YOUR_TOKEN, X-Custom-Header:value
```

### Example Payload

By default, the generic webhook sends JSON payloads like:

```json
{
  "title": "Container Image Update",
  "message": "Container Image Update Notification\n\nImage: nginx:latest\nStatus: Update Available\n..."
}
```

You can customize the JSON keys using the **Title Key** and **Message Key** fields.

---

## Ntfy Notifications

Send push notifications via [ntfy.sh](https://ntfy.sh) or your own self-hosted ntfy server.

### Setup

1. Navigate to **Settings → Notifications** in the Arcane UI
2. Select the **Ntfy** tab
3. Enable ntfy notifications and configure server and topic
4. Click **Save** and use **Test Notification** to verify

### Configuration Fields

| Field | Required | Description |
|-------|----------|-------------|
| **Host** | Yes | Ntfy server hostname (defaults to `ntfy.sh`) |
| **Port** | No | Port number for ntfy server (leave 0 for default) |
| **Topic** | Yes | Topic name to publish notifications to (treat as a password) |
| **Username** | No | Username for authentication (if required by server) |
| **Password** | No | Password for authentication (if required by server, stored encrypted) |
| **Priority** | No | Notification priority (1=Min, 2=Low, 3=Default, 4=High, 5=Max/Urgent) |
| **Tags** | No | Comma-separated tags (may map to emojis on supported clients) |
| **Icon URL** | No | URL to use as notification icon |
| **Cache Messages** | No | Allow ntfy server to cache messages (enabled by default) |
| **Firebase Notifications** | No | Send notifications via Firebase (enabled by default) |
| **Disable TLS Verification** | No | Disable TLS certificate verification (not recommended) |

### Using ntfy

1. Install the ntfy mobile app or use the web interface at [ntfy.sh](https://ntfy.sh)
2. Choose a unique topic name (this acts as your notification channel)
3. Subscribe to the topic in your ntfy client
4. Configure Arcane to send notifications to the same topic

> [!WARNING]
> Your topic name should be unique and treated like a password, as anyone who knows it can send or receive messages on that topic.

---

## Signal Notifications

Send notifications via Signal Messenger through a Signal REST API server.

### Setup

1. Set up a Signal REST API server (e.g., [signal-api](https://github.com/bbernhard/signal-cli-rest-api))
2. Navigate to **Settings → Notifications** in the Arcane UI
3. Select the **Signal** tab
4. Enable Signal notifications and configure API server details
5. Click **Save** and use **Test Notification** to verify

### Configuration Fields

| Field | Required | Description |
|-------|----------|-------------|
| **Host** | Yes | Hostname or IP address of your Signal REST API server |
| **Port** | Yes | Port number of your Signal REST API server (typically 8080) |
| **Username** | Conditional | Username for HTTP Basic Auth (use this OR API Token) |
| **Password** | Conditional | Password for HTTP Basic Auth (stored encrypted) |
| **API Token** | Conditional | Bearer token for API authentication (use this OR Username/Password) |
| **Source Phone Number** | Yes | Your Signal phone number with country code (must start with +) |
| **Recipients** | Yes | Comma-separated phone numbers (with +) or Signal group IDs |
| **Disable TLS** | No | Disable TLS/SSL for API connection (not recommended) |

### Authentication

Signal notifications support two authentication methods (choose one):

1. **HTTP Basic Auth** - Provide username and password
2. **Bearer Token** - Provide an API token

You must use one method but not both.

### Recipients Format

Recipients can be:
- Phone numbers with country code: `+1234567890`
- Signal group IDs in base64 format: `group_id_base64`
- Multiple recipients separated by commas

---

## Slack Notifications

Send notifications to Slack channels or direct messages.

### Setup

1. Navigate to **Settings → Notifications** in the Arcane UI
2. Select the **Slack** tab
3. Enable Slack notifications and configure token and settings
4. Click **Save** and use **Test Notification** to verify

### Configuration Fields

| Field | Required | Description |
|-------|----------|-------------|
| **Token** | Yes | Slack API token (xoxb-, xoxp-) or webhook token (hook-) |
| **Bot Name** | No | Display name for the bot in Slack (defaults to "Arcane") |
| **Channel** | No | Override default channel (include # for public channels) |
| **Icon** | No | Emoji (`:robot_face:`) or image URL for bot avatar |
| **Message Color** | No | Hex color code for message sidebar (e.g., `#FF0000`) |
| **Message Title** | No | Prepended text above the message |
| **Thread TS** | No | Reply in a thread (ts value of parent message) |

### Getting a Slack Token

1. Create a Slack app at [api.slack.com/apps](https://api.slack.com/apps)
2. Add bot token scopes: `chat:write`, `chat:write.public`
3. Install the app to your workspace
4. Copy the Bot User OAuth Token (starts with `xoxb-`)

Alternatively, use an [Incoming Webhook](https://api.slack.com/messaging/webhooks) (token starts with `hook-`).

---

## Telegram Notifications

Send notifications via Telegram bot to users or groups.

### Setup

1. Create a Telegram bot via [@BotFather](https://t.me/BotFather)
2. Navigate to **Settings → Notifications** in the Arcane UI
3. Select the **Telegram** tab
4. Enable Telegram notifications and configure bot settings
5. Click **Save** and use **Test Notification** to verify

### Configuration Fields

| Field | Required | Description |
|-------|----------|-------------|
| **Bot Token** | Yes | Your Telegram bot token from BotFather (stored encrypted) |
| **Chat IDs** | Yes | Comma-separated list of chat IDs to send notifications to |
| **Preview Links** | No | Enable link previews in messages (enabled by default) |
| **Enable Notification Sound** | No | Play notification sound when messages are received (enabled by default) |
| **Custom Title** | No | Custom title for notifications |

### Getting Chat IDs

To find a chat ID:

1. Send a message to your bot
2. Visit `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
3. Look for the `chat.id` value in the response
4. For groups, add the bot to the group and use the group's chat ID (negative number)

---

## Event Configuration

All notification providers support event-based subscriptions. You can choose which events trigger notifications:

### Available Events

- **Image Update Available** - Triggered when Arcane detects a newer image version during scheduled checks
- **Container Updated** - Triggered after a container has been successfully updated to the new version

### Event Configuration Options

Each provider can be configured independently:

- Enable/disable individual event types
- Mix and match: send image updates to Discord, container updates to Email
- Use multiple providers for redundancy or different audiences

### Example Configurations

**Quick Alerts Setup**
- Discord: Image Update Available ✓
- Email: Container Updated ✓
- Result: Get instant Discord alerts when updates are detected, email confirmation when containers are updated

**Comprehensive Monitoring**
- Telegram: Both events ✓
- Slack: Both events ✓
- Result: All notifications to both platforms for full visibility

---

## Testing Notifications

After configuring any notification provider:

1. Complete the configuration and click **Save**
2. Click the **Test Notification** button
3. Check your notification destination for the test message

### If Test Fails

**Discord**
- Verify webhook ID and token are correct
- Check the webhook hasn't been deleted in Discord
- Ensure the bot has permission to post in the channel

**Email**
- Verify SMTP host, port, and credentials
- Check TLS mode matches your server's requirements
- Ensure "From" and "To" addresses are valid
- Check spam/junk folders

**Generic Webhook**
- Verify the webhook URL is accessible
- Check custom headers are formatted correctly
- Test the endpoint independently to ensure it's working

**Ntfy**
- Verify the topic name is correct
- If using authentication, check username/password
- Test subscription in the ntfy app/web interface

**Signal**
- Ensure Signal REST API server is running and accessible
- Verify authentication credentials
- Check source phone number format (must start with +)
- Confirm recipients are valid

**Slack**
- Verify token is valid and not expired
- Check bot has necessary permissions (`chat:write`)
- If specifying a channel, ensure bot is a member

**Telegram**
- Verify bot token is correct
- Check chat IDs are valid (use getUpdates to confirm)
- Ensure bot isn't blocked by recipients

---

## Batch Notifications

When multiple image updates are detected simultaneously (e.g., during a scheduled check), Arcane automatically groups them into a single batch notification instead of sending individual messages. This reduces notification noise while keeping you informed of all updates.

Batch notifications include:
- Total count of images with updates
- List of all affected images
- Update details for each image
