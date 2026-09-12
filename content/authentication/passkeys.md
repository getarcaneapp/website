---
title: 'Passkeys & MFA'
description: 'Sign in without a password, or require a passkey as a second factor after your password or OIDC provider.'
---

<script lang="ts">
import { Snippet } from '#lib/components/ui/snippet/index.js';
import { Link } from '#lib/components/ui/link/index.js';
</script>

A passkey authenticates you through your phone, computer, or hardware key. Arcane supports:

- **Passwordless sign-in** — select **Passkey** on the login page and follow your device's prompt to sign in without a password.
- **Passkey MFA** — sign in with your password or OIDC provider, then confirm with a passkey.

Registering a passkey does not turn on MFA. Enabling MFA is a separate switch.

> [!IMPORTANT]
> Set `APP_URL` to your public HTTPS URL before registering passkeys. Its hostname becomes the WebAuthn relying party ID; the full URL supplies the origin. A missing hostname prevents startup, and passkeys won't work at a different hostname. See <Link href="/docs/configuration/environment">Environment Variables</Link>.

Browsers only expose the WebAuthn API in a secure context, so passkeys need HTTPS (or `localhost`). On a plain-HTTP deployment Arcane shows _"Passkeys require a supported browser and a secure HTTPS connection."_ and hides the controls. See <Link href="/docs/networking/tls">TLS</Link> or put Arcane behind a terminating <Link href="/docs/networking/proxy">proxy</Link>.

## Register a passkey

1. Open **Account** from the sidebar user menu, on the **Account** tab.
2. In the **Passkeys** section, select **Add passkey**.
3. Give it a name you will recognize later — the device it lives on, usually.
4. Complete the prompt your browser or operating system shows.

Each passkey is listed with its name and when it was last used. You can rename or delete any of them from the same section.

Register more than one. A passkey lives on a single device; if that device is your only way in and you lose it, you are relying on recovery codes.

When registering, Arcane offers post-quantum ML-DSA algorithms first. Authenticators that support them create ML-DSA credentials; everything else falls back to the classical algorithms (EdDSA, ES256, RS256), and existing passkeys keep working unchanged.

## Turn on passkey MFA

You need at least one registered passkey first — it becomes the second step.

1. In the same **Passkeys** section, find **Passkey MFA** and select **Enable MFA**.
2. Arcane generates **10 single-use recovery codes** and shows them once, immediately.
3. Save them somewhere secure before closing the message. They are the only way back in if you lose your passkey.

From then on, signing in with a password or through OIDC stops at an MFA step offering **Use passkey** or **Use recovery code**.

The panel shows how many recovery codes remain. **Regenerate codes** issues a fresh set of 10 and invalidates the old ones — the new codes are also shown only once.

Disabling MFA deletes your remaining recovery codes and leaves your passkeys registered, so sign-in falls back to password or OIDC alone.

## Confirming your identity before changes

Changes to passkeys, MFA, or recovery codes require **Confirm your identity** with a passkey or current password. Confirmation and individual passkey prompts expire after 5 minutes.

OIDC-only accounts need an accessible passkey for this step. Without one, use `arcane admin reset-mfa` as described in <Link href="/docs/security/account-recovery">Account Recovery</Link>.

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
