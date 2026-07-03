---
title: 'Arcane Mobile'
description: 'Use Arcane from your iPhone or iPad.'
---

Arcane Mobile is the official iOS companion app for Arcane. It lets you check your Docker environments, review what needs attention, and run common actions from your iPhone or iPad.

Use it when you want a quick view of your Arcane server without opening the web dashboard.

## Before you start

You need:

- an iPhone or iPad running iOS 18 or iPadOS 18 or later
- an Arcane server that your device can reach
- your Arcane username and password, or access through OIDC if your server uses single sign-on

For the smoothest setup, use an Arcane URL with HTTPS, such as `https://arcane.example.com`.

If you are connecting to Arcane on your local network, include the full URL with the scheme and port, for example `http://192.168.1.50:3552`. Without `http://` or `https://`, iOS may not know how to reach the server.

## Install the beta

Arcane Mobile is currently available through TestFlight.

1. Open the [Arcane Mobile TestFlight beta](https://testflight.apple.com/join/Y9KUft8F) on your iPhone or iPad.
2. Install TestFlight if Apple asks you to.
3. Join the beta and install Arcane Mobile.
4. Open **Arcane** from your Home Screen.

## Connect to your server

The first time you open the app, enter your Arcane server URL.

Use the same address you would use in a browser:

- `https://arcane.example.com` for a server behind a domain or reverse proxy
- `http://192.168.1.50:3552` for a local server on your home network

If Arcane is only available inside your home network, your iPhone or iPad must be on that network too. If you want to use Arcane while away from home, connect through your VPN or expose Arcane through a secure reverse proxy.

## Sign in

After the app reaches your server, sign in with your Arcane account.

If your server uses OIDC single sign-on, the app shows the OIDC sign-in option. You can still reveal the username and password form when local sign-in is available.

If you just want to try the app, tap **Try the demo** on the sign-in screen. The demo starts a temporary Arcane instance for about 10 minutes and does not need an account.

## What you can do

Arcane Mobile is designed for the tasks you are most likely to check from a phone:

- **Dashboard** shows your environments, live resource health, and a **Needs Attention** summary for offline environments, vulnerabilities, stopped containers, updates, expiring keys, and failed activity.
- **Containers** lets you view containers, read logs, inspect details, and run actions such as start, stop, restart, and redeploy.
- **Images** helps you review image updates, vulnerabilities, image details, and cleanup actions.
- **Projects** lets you manage Compose projects, view project details, run project actions, and browse custom project files.
- **Volumes**, **Networks**, and **Ports** help you inspect the Docker resources behind your services.
- **Updates**, **Activities**, and **Events** give you a quick view of image updates, recent work, and server activity.
- **Settings** includes admin tools such as users, API keys, registries, templates, notifications, webhooks, system settings, authentication, roles, and OIDC role mappings when your account can access them.

Arcane Mobile also supports Home Screen and Lock Screen widgets, plus Siri and Shortcuts actions for opening tabs, opening containers and projects, restarting containers, and starting or stopping projects with confirmation.

## Tips

- Use **Settings** to reach tools that are not pinned to the bottom tab bar.
- Long-press a bottom tab to replace it with another frequently used area.
- If you manage more than one environment, check the active environment before running actions.
- Some tabs only appear for admins, users with the right role, or servers that support newer Arcane features.
- For role and permission details, see [Role-Based Access](/docs/security/rbac).

## Troubleshooting

**The app cannot reach my server.** Check that your device can open the same Arcane URL in Safari. If it cannot, the app cannot reach it either.

**A local server does not connect.** Make sure the address includes `http://`, the IP address, and the port. For example: `http://192.168.1.50:3552`.

**A public server does not connect.** Check that the URL uses HTTPS and that your reverse proxy forwards WebSocket traffic to Arcane.

**I signed in, but tabs are missing.** Your account may not have permission for those areas, or the server may not support that feature yet. Ask an Arcane admin to check your role assignments.

**I changed servers and still see old data.** Open **Settings**, sign out, and sign in to the server again.

## Get help

If you run into trouble, you can:

- ask in the [Arcane Discord](https://discord.gg/WyXYpdyV3Z)
- report iOS app issues on [GitHub](https://github.com/getarcaneapp/ios/issues)
- check the [Arcane installation guide](/docs/setup/installation) if you are still setting up your server
