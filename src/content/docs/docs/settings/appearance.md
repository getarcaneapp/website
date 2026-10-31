---
title: 'Appearance & Preferences'
description: 'Personalize themes, navigation, and display options for your Arcane account.'
---

Open **Account → Preferences** to set your language, theme, navigation, environment colors, and profile picture. Preferences belong to your account, follow you to any browser, and don't affect other users. Only the [profile picture limits](#set-profile-picture-limits-admins) are server-wide.

> [!NOTE]
> If you upgraded from a release with server-wide appearance settings, they were copied to every user account, so Arcane looks the same as before.

## General

- **Language** — the interface language.
- **Time Format** — how Arcane renders timestamps.

## Appearance

- **Theme** — Light, Dark, or System (follows your operating system).
- **Font size** — scales text and UI density.
- **Icon Catalog** — **selfh.st** or **Dashboard Icons**, used to resolve project and container icon slugs. See [Compose Labels](/docs/reference/compose-labels).
- **Application Theme** — Default, Graphite, Ocean, Amber, GitHub, Nord, Everforest, or Rosé Pine.
- **Accent Color** — the highlight color used across the UI.
- **OLED Mode** — deepens backgrounds to true black. Applies to the Default theme only; alternate presets ignore it.
- **Glass & Blur Effects** — translucent panel surfaces.
- **Interface Animations** — turn off to reduce motion.
- **Toast Position** — where pop-up messages appear. **Auto** uses top center on mobile and tablet, bottom right on desktop.
- **Editor tab width** — 2, 4, or 8 spaces, for code editors and YAML formatting.

## Navigation

- **Default Landing Page** — where you land after sign-in: Dashboard (default), Projects, Environments, Containers, Images, Updates, Networks, or Volumes. If your choice becomes unavailable, Arcane falls back to the Dashboard.
- **Enable Hover Expansion** — expand the collapsed sidebar on hover.
- **Keyboard Shortcuts** — turn Arcane's keyboard shortcuts on or off.

## Environments

- **Environment labels**: show each row's environment by **Name**, or as a **Color dot** with the name on hover.
- **Environment colors**: pick a unique color for each environment's name in lists. **Reset** restores the defaults.

## Mobile appearance

- **Navigation Mode** — **Floating** or **Docked** mobile navigation bar.
- **Show Labels** — show text labels under the mobile navigation icons.

## Upload a profile picture

Upload a PNG, JPEG, or WebP image from **Account**. Arcane opens a crop dialog and stores the cropped image as your profile picture.

## Set profile picture limits (admins)

These apply to every user, under **System → Users**:

- **Enable Gravatar** — use Gravatar as the fallback for users without an uploaded photo. Off by default on new installations; upgrades keep their current value. Setting `ARCANE_ENABLE_GRAVATAR=true` or `false` on the Arcane container overrides this and locks it in the UI.
- **Profile Picture Upload Size (MB)** — maximum cropped image size. Default 2 MB, range 1–50 MB.
