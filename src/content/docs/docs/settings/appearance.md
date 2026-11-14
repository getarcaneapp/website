---
title: "Appearance & Preferences"
description: "Personalize themes, fonts, navigation, and editor options for your Arcane account."
---

Open **Account → Preferences** to set your theme, fonts, layout, language, editor, and agent colors. Preferences belong to your account, follow you to any browser, and don't affect other users. Two exceptions are saved on the current device only: **Theme** (Light, Dark, or System) and **Layout**. Only the [profile picture limits](#set-profile-picture-limits-admins) and [logo and icons](#replace-the-logo-and-icons-admins) are server-wide.

> [!NOTE]
> If you upgraded from a release with server-wide appearance settings, they were copied to every user account, so Arcane looks the same as before.

## Theme

- **Theme:** Light, Dark, or System (follows your operating system).
- **Application Theme:** Default, Abyss, Amber, Carbon, Everforest, GitHub, Graphite, Mono, Neon, Nord, Ocean, Rosé Pine, or Twilight.
- **Import Theme:** add a custom theme from a JSON file or pasted JSON. Up to 20. Export or delete a custom theme from its card menu.
- **Accent Color:** the highlight color used across the UI.
- **OLED Mode:** true-black backgrounds. Works only with the Default application theme in dark mode.
- **Icon Catalog:** **selfh.st** or **Dashboard Icons**, used to resolve project and container icon slugs. See [Compose Labels](/docs/reference/compose-labels).

## Background & Effects

- **Background Image:** **None**, one of the built-in photos, or your own upload (PNG, JPEG, or WebP, up to 10 MB). Panels turn to frosted glass over it.
- **Dim in Dark Mode:** darkens the background image in dark mode.
- **Glass & Blur Effects:** translucent panel surfaces. Turn off for solid surfaces and lower GPU usage.
- **Interface Animations:** turn off to reduce motion.

## Text & Fonts

- **Font size:** scales text and UI density.
- **Interface font:** font for interface text.
- **Monospace font:** font for IDs and other monospace text.
- **Code font:** font for the code editor, code blocks, and terminal. An open terminal picks it up when reopened.

Each font is **Default**, **System UI**, or **Custom**. For **Custom**, type an installed font name or pick one with **Browse installed fonts** (only in browsers that support reading local fonts). Chinese, Japanese, and Korean text always uses your system fonts.

## Layout & Navigation

- **Layout:** **Automatic** (mobile layout on narrow screens), **Mobile** (card lists and bottom navigation), or **Desktop** (tables and sidebar).
- **Default Landing Page:** the page that opens after sign-in. If it becomes unavailable, Arcane opens the Dashboard.
- **Keyboard Shortcuts:** turn Arcane's keyboard shortcuts on or off. Off also hides shortcut hints in tooltips.
- **Toast Position:** where pop-up messages appear. **Automatic** uses top center on mobile and tablet, bottom right on desktop.
- **Mobile Navigation Labels:** show text labels under the mobile navigation icons.

To choose, move, and resize Dashboard widgets, select **Edit layout** on the Dashboard. The layout is saved to your account. See [Dashboard](/docs/get-started/dashboard).

On desktop, list pages have a **List view** / **Grid view** toggle in the table toolbar. Your browser remembers the choice for each list.

## Language & Region

- **Language:** the interface language.
- **Time Format:** how Arcane shows timestamps.

## Editor

- **Default project editor layout:** **Classic** (Compose and environment editors side by side) or **Tree** (workspace file tree with tabbed editors).
- **Editor tab width:** 2, 4, or 8 spaces, for code editors and document formatting.

## Agents

- **Agent labels:** show each row's agent by **Name**, or as a **Color dot** with the name on hover.
- **Agent colors:** pick a color for each agent's name in lists, or choose **Custom** and enter any CSS color (hex, rgb, or hsl). A color already used by another agent can't be picked. **Reset** restores the defaults.

## Upload a profile picture

1. Open **Account**.
2. Upload a PNG, JPEG, or WebP image.
3. Crop it in the dialog. Arcane stores the cropped image as your profile picture.

## Set profile picture limits (admins)

These apply to every user, under **System → Users**:

- **Enable Gravatar:** use Gravatar for users without an uploaded photo. Off by default on new installations; upgrades keep their current value. Setting `ARCANE_ENABLE_GRAVATAR=true` or `false` on the Arcane container overrides this and locks it in the UI.
- **Profile Picture Upload Size (MB):** maximum cropped image size. Default 2 MB, range 1–50 MB.

## Replace the logo and icons (admins)

**System → Branding** replaces Arcane's images for every user. This needs `settings:update`.

Under **Logos and icons**, each image has **Upload** (**Replace** once set) and **Remove**. **Remove** restores the built-in image.

| Image         | Accepted files                     | Where it shows                                        |
| ------------- | ---------------------------------- | ----------------------------------------------------- |
| **Icon mark** | PNG, JPEG, WebP, or SVG            | Collapsed sidebar, sign-in pages, and version dialog. |
| **Full logo** | PNG, JPEG, WebP, or SVG            | Expanded sidebar.                                     |
| **Favicon**   | PNG, SVG, or ICO                   | Browser tab.                                          |
| **App icon**  | Square PNG, 512×512 to 4096×4096   | Installed app and home screen icons.                  |

- Each file can be up to 2 MB.
- Arcane resizes the **App icon** to every app icon size.
- Uploaded images replace the development artwork on [preview builds](/docs/get-started/preview-builds).
- The API endpoints are `PUT` and `DELETE` on `/api/app/images/logo/{mark|full}`, `/api/app/images/favicon`, and `/api/app/images/pwa`. Uploads are `multipart/form-data` with a `file` field.
