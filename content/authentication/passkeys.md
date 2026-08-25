---
title: 'Passkeys & MFA'
description: 'Sign in without a password, or require a passkey as a second factor after your password or OIDC provider.'
---

<script lang="ts">
import { Snippet } from '#lib/components/ui/snippet/index.js';
import { Link } from '#lib/components/ui/link/index.js';
</script>

A passkey is a credential stored on your device — a phone, a laptop's secure enclave, a hardware key — that proves who you are without sending a secret to Arcane. Arcane uses passkeys two ways, and they are independent of each other:

- **Passwordless sign-in** — select **Passkey** on the login page and you are in. No password typed.
- **Passkey MFA** — you still sign in with your password or OIDC provider, then Arcane asks for a passkey before letting you through.

Registering a passkey does not turn on MFA. Enabling MFA is a separate switch.

> [!IMPORTANT]
> Passkeys are bound to the hostname you serve Arcane from. Arcane derives the WebAuthn relying party ID from the hostname of `APP_URL`, and the origin from `APP_URL` itself. If `APP_URL` has no hostname the passkey service fails to start, and a passkey registered at one hostname will not work at another. Set `APP_URL` to the URL your users actually browse to, over HTTPS, before anyone registers a passkey. See <Link href="/docs/configuration/environment">Environment Variables</Link>.

Browsers only expose the WebAuthn API in a secure context, so passkeys need HTTPS (or `localhost`). On a plain-HTTP deployment Arcane shows _"Passkeys require a supported browser and a secure HTTPS connection."_ and hides the controls. See <Link href="/docs/networking/tls">TLS</Link> or put Arcane behind a terminating <Link href="/docs/networking/proxy">proxy</Link>.

## Register a passkey

1. Open **Account** from the sidebar user menu, on the **Account** tab.
2. In the **Passkeys** section, select **Add passkey**.
3. Give it a name you will recognize later — the device it lives on, usually.
4. Complete the prompt your browser or operating system shows.

Each passkey is listed with its name and when it was last used. You can rename or delete any of them from the same section.

Register more than one. A passkey lives on a single device; if that device is your only way in and you lose it, you are relying on recovery codes.

## Turn on passkey MFA

You need at least one registered passkey first — it becomes the second step.

1. In the same **Passkeys** section, find **Passkey MFA** and select **Enable MFA**.
2. Arcane generates **10 single-use recovery codes** and shows them once, immediately.
3. Save them somewhere secure before closing the message. They are the only way back in if you lose your passkey.

From then on, signing in with a password or through OIDC stops at an MFA step offering **Use passkey** or **Use recovery code**.

The panel shows how many recovery codes remain. **Regenerate codes** issues a fresh set of 10 and invalidates the old ones — the new codes are also shown only once.

Disabling MFA deletes your remaining recovery codes and leaves your passkeys registered, so sign-in falls back to password or OIDC alone.

## Confirming your identity before changes

Changing anything in this section — adding, renaming, or deleting a passkey, enabling or disabling MFA, regenerating recovery codes — first asks you to authenticate again, with a passkey or your current password. The dialog is titled **Confirm your identity**.

That confirmation is good for 5 minutes, as is any individual passkey prompt. If you sit on the page longer than that, expect to be asked again.

An OIDC-only account with no password, on a browser holding none of its passkeys, has no way to complete this step. Arcane says so explicitly and points at `arcane admin reset-mfa` — see <Link href="/docs/security/account-recovery">Account Recovery</Link>.

## The CLI and MFA-enabled accounts

`arcane-cli auth login` uses a browser device flow, which cannot carry an MFA challenge. On an account with MFA enabled it fails with:

> this account has MFA enabled, which browser-based CLI login cannot complete; create a personal API key in Arcane (Account -> API keys) and run: `arcane config set api-key <key>`

Create a personal API key from the **API keys** section of the same **Account** page, then:

<Snippet text="arcane config set api-key <key>" class="mt-2 mb-4 w-full" />

Personal API keys inherit your role's permissions. See <Link href="/docs/cli/config">CLI Configuration</Link>.

## Locked out

If you have lost both your passkeys and your recovery codes, an operator with shell access to the Arcane container can clear MFA for the account. That path is deliberately gated and documented separately in <Link href="/docs/security/account-recovery">Account Recovery</Link>.

## Related

- <Link href="/docs/authentication/sso">OIDC Single Sign-On</Link> — passkey MFA layers on top of OIDC sign-in.
- <Link href="/docs/authentication/rbac">Access Control</Link> — what an account can do once it is in.
