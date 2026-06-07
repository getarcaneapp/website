---
title: Privacy Policy — Arcane
description: This policy explains how Arcane handles your information.
---

**Effective date:** May 29, 2026

Arcane (including the self-hosted server, web dashboard, and official companion mobile apps) is an open-source Docker management platform. This policy explains how our software handles your information.

**In short: Arcane does not collect, sell, or share your personal data, and the project maintainers never receive any of your data.**

## Summary

- We do **not** collect personal data, usage tracking, advertising identifiers, or user telemetry.
- To help us understand active deployments, self-hosted Arcane servers send a lightweight, anonymous "heartbeat" containing only a randomly generated instance ID (UUID), server type, and version. This can be disabled at any time.
- Your login credentials, keys, and settings stay **in your own environment or on your device**.
- There are no third-party trackers or ad networks in our software.

## Information stored locally

The following is stored locally on your own server or device and is never transmitted to Arcane maintainers:

- **Authentication credentials & session tokens** — stored securely in your self-hosted instance database or your device's secure storage (such as the iOS Keychain for the mobile app) so you can access your resources.
- **Connection settings** — server URLs, API keys, and your preferences, stored locally.
- **Cache** — images (such as container and application icons) and recent API responses are cached locally to improve performance.

You can remove this data at any time by deleting your local configuration, signing out, or removing the app/hosting volume.

## Arcane Mobile account deletion

Arcane Mobile connects to user-managed Arcane servers. Account data is stored on the Arcane server selected by the user, not in the Android app.

To delete an Arcane account:
1. Ask an administrator of your Arcane server to delete your user from Settings > Users.
2. If you are the administrator, open Arcane, go to Settings > Users, select the user, and delete the account.
3. For hosted demo accounts, data is temporary and deleted when the demo session ends.

## Information sent over the network

- **Your Docker hosts & servers.** All communications between your dashboard/client and your Docker environments happen directly within your own network or over the connections you establish. This data is managed or operated by you or your organization, and handling of this data is governed by your own configuration — not by Arcane project maintainers.
- **Anonymous Telemetry (Heartbeat).** To help us measure the active instance counts and version distribution of Arcane, self-hosted instances send a periodic anonymous heartbeat payload to `checkin.getarcane.app`. This payload contains **only** a randomly generated UUID instance identifier (`instance_id`), the server mode (`server_type`), and the version build (`version`). It contains no user identifiers, IP addresses (beyond the normal TCP transport level), configurations, or project metadata. For full details on verification and how to disable this entirely (via `ANALYTICS_DISABLED=true`), please see our [Analytics Documentation](/docs/configuration/analytics).
- **Single sign-on (OIDC).** If you configure OIDC, authentication happens directly between your instances/clients and your identity provider.
- **Demo mode (optional).** If you use the public demo, you connect to a temporary demo environment hosted by the Arcane project (`demo.getarcane.app`). Demo sessions are temporary, automatically provisioned, and expire after a short period. Please do not enter real or sensitive data into the demo.

## Third-party services

Our software does **not** include third-party analytics, advertising, or tracking SDKs.

- **App ratings (mobile).** The mobile app may occasionally ask you to rate it using standard OS rating prompts. This is handled entirely by the operating system provider (such as Apple's App Store / StoreKit); the project maintainers receive no personal information from it.

## Tracking

Arcane does **not** track you across apps or websites, and does not collect data for tracking.

## Children's privacy

Arcane is a developer and IT administration tool, is not directed at children, and does not knowingly collect information from children.

## Changes to this policy

If this policy changes, the updated version will be published at this URL with a new effective date.

## Contact

Arcane is an open-source project. If you have questions about privacy:

- Open an issue: https://github.com/getarcaneapp/arcane/issues
- Join the community: https://discord.gg/WyXYpdyV3Z
