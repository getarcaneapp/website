---
title: 'Arcane Mobile'
description: 'Use Arcane from your iPhone or iPad.'
---

## Before you start

- an iPhone or iPad running iOS 18 or iPadOS 18 or later
- an Arcane server that your device can reach
- your Arcane username and password, or access through OIDC if your server uses single sign-on

## Install the beta

1. Open the [Arcane Mobile TestFlight beta](https://testflight.apple.com/join/Y9KUft8F) on your iPhone or iPad.
2. Install TestFlight if Apple asks you to.
3. Join the beta and install Arcane Mobile.
4. Open **Arcane** from your Home Screen.

<span id="get-help"></span>

Report beta app bugs in the [iOS issue tracker](https://github.com/getarcaneapp/ios/issues) or discuss the beta in [Arcane Discord](https://discord.gg/WyXYpdyV3Z).

## Connect to your server

Enter your full Arcane URL, including `https://` or `http://` and any port:

- `https://arcane.example.com` for a server behind a domain or reverse proxy
- `http://192.168.1.50:3552` for a local server on your home network

For a home-network server, your device needs local access or a VPN. Include the protocol, IP address, and port as shown above. For public access, use HTTPS with a secure reverse proxy that forwards WebSocket traffic to Arcane.

<span id="troubleshooting"></span>

If the app cannot connect, open the same Arcane URL in Safari on your device. If Safari cannot reach it, the app cannot either. If you are still setting up the server, follow the [Arcane installation guide](/docs/get-started/installation).

## Sign in

Sign in with your Arcane account or the server's OIDC provider. The username and password form is available if local sign-in is enabled.

To try the app without an account, tap **Try the demo** for a temporary instance lasting about 10 minutes.

If you changed servers and still see old data, sign out from **Settings** and sign in to the server again.

## What you can do

- **Dashboard** shows resource health and **Needs Attention** items: offline hosts, vulnerabilities, stopped containers, updates, expiring keys, and failed activity.
- **Containers** has logs, details, and start, stop, restart, and redeploy actions.
- **Images** has image details, updates, vulnerabilities, and cleanup actions.
- **Projects** has Compose actions and a project file browser.
- **Volumes**, **Networks**, and **Ports** show Docker resources.
- **Updates**, **Activities**, and **Events** show pending updates and operation history.
- **Settings** has administration tools allowed by your role, including users, keys, registries, templates, notifications, webhooks, authentication, and roles.

Arcane Mobile also supports Home Screen and Lock Screen widgets, plus Siri and Shortcuts actions for opening tabs, opening containers and projects, restarting containers, and starting or stopping projects with confirmation.

## Push notifications

1. An admin turns on **Mobile push notifications** on the server under **Settings → Notifications → Mobile Push**.
2. In the app, open **Settings** and enable push notifications to pair your device.
3. Choose which events and environments the device should be notified about.

Paired devices show up on the server's **Mobile Push** tab, where an admin can send a test notification or remove a device.

Notification titles and messages travel through Arcane's hosted push relay (`apns.getarcane.app`) and Apple's push servers. Your server address, users, and credentials are never sent.

<span id="tips"></span>

## Navigation

- Use **Settings** to reach tools that are not pinned to the bottom tab bar.
- Long-press a bottom tab to replace it with another frequently used area.
- If you manage more than one environment, check the active environment before running actions.

Tab visibility depends on your role and the features your server supports. If a tab is missing, ask an Arcane admin to check your role assignments. See [Role-Based Access](/docs/authentication/rbac) for permission details.
