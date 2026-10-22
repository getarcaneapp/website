---
title: 'Passkeys & MFA'
description: 'Sign in without a password, or require a passkey as a second factor after your password or OIDC provider.'
---

A passkey signs you in with your phone, computer, or hardware key. Use it for:

- **Passwordless sign-in:** select **Passkey** on the login page and follow your device's prompt.
- **Passkey MFA:** sign in with your password or OIDC provider, then confirm with a passkey.

Registering a passkey does not turn on MFA. That's a separate switch.

## Before you start

1. Serve Arcane over HTTPS (or `localhost`). Browsers only allow passkeys in a secure context. See [TLS](/docs/networking/tls) or use a [reverse proxy](/docs/networking/reverse-proxy) that terminates HTTPS.
2. Set `ARCANE_APP_URL` to your public HTTPS URL. See [Environment Variables](/docs/reference/environment-variables).

> [!IMPORTANT]
> The hostname in `ARCANE_APP_URL` becomes the WebAuthn relying party ID. Its scheme and host define the only allowed origin, so passkeys won't work at a different address. If the URL is invalid, Arcane still starts but passkeys are unavailable.

Over plain HTTP, Arcane shows _"Passkeys require a supported browser and a secure HTTPS connection."_ and hides the controls.

## Register a passkey

1. Open **Account** from the sidebar user menu, on the **Account** tab.
2. In **Passkeys**, select **Add passkey**.
3. Name it something recognizable, usually its device.
4. Complete your browser or OS prompt.

The list shows each passkey's name and last use; rename or delete them there.

Passkeys come in two kinds:

- **Synced:** stored in a password manager or platform account (for example iCloud Keychain or Google Password Manager). It follows you to your other signed-in devices.
- **Device-bound:** stays on one device, such as a hardware security key. Lose the device and you lose the passkey.

Keep a second way in either way: register a second passkey, keep your password, or save your recovery codes when you turn on MFA. Arcane prefers post-quantum ML-DSA keys when your authenticator supports them, otherwise classical algorithms.

## Turn on passkey MFA

You need at least one registered passkey first.

1. In **Passkeys**, find **Passkey MFA** and select **Enable MFA**.
2. Save the **10 single-use recovery codes** somewhere safe. Arcane shows them once, and they're your only way in if you lose your passkey.

Password and OIDC sign-ins then stop at an MFA step offering **Use passkey** or **Use recovery code**. The panel shows remaining codes; **Regenerate codes** issues 10 new ones (shown once) and invalidates the old ones.

Disabling MFA deletes remaining recovery codes but keeps your passkeys, so sign-in falls back to password or OIDC alone. Lost both passkeys and codes? An operator with shell access to the container can clear MFA; see [Account Recovery](/docs/access/account-recovery).

## Confirm your identity before changes

Changing passkeys, MFA, or recovery codes requires **Confirm your identity** with a passkey or current password. Confirmation and passkey prompts expire after 5 minutes. OIDC-only accounts need an accessible passkey here; without one, use `arcane admin reset-mfa` ([Account Recovery](/docs/access/account-recovery)).

## Use the CLI with MFA enabled

`arcane-cli auth login` uses a browser device flow that can't carry an MFA challenge, so it fails with MFA on. Create a personal API key under **API keys** on the **Account** page, then run:

```bash
arcane-cli config set api-key <key>
```

A personal API key has the same permissions as your account, checked on every request. For a key limited to specific permissions, create a scoped key under **System → API Keys** and select only what the CLI needs ([Scope API keys](/docs/access/roles#scope-api-keys)). See [CLI Configuration](/docs/reference/cli/config).

## Related

- [OIDC Single Sign-On](/docs/access/sso): passkey MFA works on top of OIDC sign-in.
- [Roles & Permissions](/docs/access/roles): what an account can do once signed in.
