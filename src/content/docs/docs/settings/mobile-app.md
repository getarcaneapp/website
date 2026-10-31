---
title: 'Arcane Mobile'
description: 'Use Arcane from your iPhone, iPad, or Android phone.'
---

Use Arcane Mobile on iPhone, iPad, or Android to check your servers, run container and project actions, and get push notifications.

## Before you start

- An iPhone or iPad on iOS/iPadOS 18 or later, or an Android phone with Google Play.
- An Arcane server your device can reach, and your Arcane username and password (or OIDC access if the server uses single sign-on).

## Install the beta

### iPhone and iPad

1. Open the [Arcane Mobile TestFlight beta](https://testflight.apple.com/join/Y9KUft8F) on your device, installing TestFlight if Apple asks.
2. Join the beta and install Arcane Mobile.
3. Open **Arcane** from your Home Screen.

### Android

1. Join the [Arcane Mobile beta Google group](https://groups.google.com/g/arcane-mobile-beta) with the Google account you use on your phone.
2. Open the [beta opt-in page](https://play.google.com/apps/testing/app.getarcane.android) and tap **Become a tester**.
3. Install [Arcane Mobile from Google Play](https://play.google.com/store/apps/details?id=app.getarcane.android).

If Google Play says the app isn't available, wait a few minutes after opting in and retry. Play must be signed in with the Google account that joined the group. Report beta bugs in the [Arcane Mobile issue tracker](https://github.com/getarcaneapp/mobile/issues) or discuss the beta in [Arcane Discord](https://discord.gg/WyXYpdyV3Z).

## Connect to your server

Enter your full Arcane URL, including the protocol and any port:

- `https://arcane.example.com` for a server behind a domain or reverse proxy
- `http://192.168.1.50:3552` for a local server on your home network

A home-network server needs local access or a VPN. For public access, use HTTPS with a secure reverse proxy that forwards WebSocket traffic to Arcane.

If the app can't connect, open the same URL in your phone's browser; if that fails, the app will too. Still setting up the server? Follow the [Arcane installation guide](/docs/get-started/installation).

## Sign in

Sign in with your Arcane account (if local sign-in is enabled) or the server's OIDC provider. To try the app without an account, tap **Try the demo** for a temporary instance lasting about 10 minutes.

If you changed servers and still see old data, sign out from **Settings** and sign in to the server again.

## What you can do

- **Dashboard** shows resource health and **Needs Attention** items: offline hosts, vulnerabilities, stopped containers, updates, expiring keys, and failed activity.
- **Containers** has logs, details, and start, stop, restart, and redeploy actions.
- **Images** has image details, updates, vulnerabilities, and cleanup actions.
- **Projects** has Compose actions and a project file browser.
- **Volumes**, **Networks**, and **Ports** show Docker resources.
- **Updates**, **Activities**, and **Events** show pending updates and operation history.
- **Settings** has the admin tools your role allows: users, keys, registries, templates, notifications, webhooks, authentication, and roles.
- **Widgets and Siri**: Home Screen and Lock Screen widgets, plus Siri and Shortcuts actions to open tabs, containers, and projects, restart containers, and start or stop projects with confirmation.

## Set up push notifications

1. On the server, turn on **Mobile push notifications** under **System → Notifications**. This needs the `settings:write` permission.
2. In the app, open **Settings** and enable push notifications to pair your device.
3. Choose the events and environments for this device. Each device has its own selection, so two phones can get different alerts.

Paired devices appear under **Your mobile devices** on the server's **System → Notifications** page, where you can test or remove them. Notification titles and messages travel through Arcane's hosted push relay (`apns.getarcane.app`) and Apple's push servers. Your server address, users, and credentials are never sent.

## Find your way around

- Use **Settings** to reach tools not pinned to the bottom tab bar.
- Long-press a bottom tab to replace it with another area.
- With several environments, check the active one before running actions.

Tabs depend on your role and your server's features. If one is missing, ask an admin to check your role bindings. See [Roles & Permissions](/docs/access/roles).
