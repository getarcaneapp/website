---
title: 'Appearance & Preferences'
description: 'Personalize themes, navigation, and display options for your Arcane account.'
---

<script lang="ts">
import { Link } from '#lib/components/ui/link/index.js';
</script>

Appearance in Arcane is **per user**. Every option below is saved to your own account and follows you to any browser you sign in from — changing your theme does not change anyone else's.

Open **Account → Preferences** to find all of them.

> [!NOTE]
> Earlier versions configured appearance server-wide under Settings → Appearance. That page has been removed. When you upgrade, your existing settings are copied to every user account automatically, so Arcane looks exactly the same as it did before.

## General

- **Language** — the interface language.
- **Time Format** — how Arcane renders timestamps.

## Appearance

- **Theme** — Light, Dark, or System. System follows your operating system.
- **Font size** — scales text and UI density.
- **Icon Catalog** — which catalog resolves project and container icon slugs: **selfh.st** or **Dashboard Icons**. See <Link href="/docs/guides/custom-metadata">Custom Metadata</Link> for how icon slugs are applied.
- **Application Theme** — the overall visual theme (see below).
- **Accent Color** — the highlight color used across the UI.
- **OLED Mode** — deepens backgrounds to true black.
- **Glass & Blur Effects** — translucent panel surfaces.
- **Interface Animations** — turn off to reduce motion.

### Available theme variants

- Default
- Graphite
- Ocean
- Amber
- GitHub
- Nord
- Everforest
- Rosé Pine

OLED mode applies to the Default theme. If you switch to one of the alternate presets, Arcane keeps that preset active instead of layering OLED mode on top of it.

## Navigation

- **Default Landing Page** — where Arcane sends you after you sign in. The default is the Dashboard. You can choose any of: Dashboard, Projects, Environments, Containers, Images, Updates, Networks, or Volumes. If a saved choice ever becomes unavailable, Arcane falls back to the Dashboard.
- **Enable Hover Expansion** — expand the collapsed sidebar when you hover it.
- **Keyboard Shortcuts** — enable or disable Arcane's keyboard shortcuts.

## Mobile Appearance

- **Navigation Mode** — **Floating** or **Docked** mobile navigation bar.
- **Show Labels** — show text labels beneath the mobile navigation icons.

## Profile pictures

Upload a custom profile picture from **Account**. Arcane accepts PNG, JPEG, and WebP images, opens a crop dialog before upload, and stores the cropped image as your profile picture.

Profile picture behavior is server-wide and admin-controlled, under **Settings → Users**:

- **Enable Gravatar** — use Gravatar as the fallback source for users without an uploaded photo.
- **Profile Picture Upload Size (MB)** — maximum cropped image size users can upload. The default is 2 MB, and the allowed range is 1–50 MB.
