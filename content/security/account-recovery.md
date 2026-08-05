---
title: 'Account Recovery'
description: 'Reset an administrator password or clear passkey MFA from inside the Arcane container when nobody can sign in.'
---

<script lang="ts">
import { Snippet } from '#lib/components/ui/snippet/index.js';
import { Link } from '#lib/components/ui/link/index.js';
</script>

When every administrator is locked out — a forgotten password, a lost passkey with no recovery codes left — Arcane ships two recovery commands that run inside its own container, against the database directly, without starting the HTTP server.

> [!NOTE]
> These are subcommands of the `arcane` binary **inside the Arcane container**, not the standalone <Link href="/docs/cli/commands">`arcane-cli`</Link> you install on your workstation. `arcane-cli` talks to the API over the network and cannot help you when you cannot sign in.

Both commands are disabled by default. Anyone who can run them can take over an administrator account, so you turn the gate on deliberately, recover, and turn it back off.

| Command                       | Enabled by                      |
| ----------------------------- | ------------------------------- |
| `arcane admin reset-password` | `ALLOW_CLI_PASSWORD_RESET=true` |
| `arcane admin reset-mfa`      | `ALLOW_CLI_MFA_RESET=true`      |

Run without the gate set and the command refuses:

<Snippet text="CLI password reset is disabled; set ALLOW_CLI_PASSWORD_RESET=true to enable it" class="mt-2 mb-4 w-full" />

## Reset an administrator password

1. Add `ALLOW_CLI_PASSWORD_RESET=true` to Arcane's environment and recreate the container.
2. Run the command interactively:

<Snippet text="docker exec -it arcane arcane admin reset-password" class="mt-2 mb-4 w-full" />

3. Enter the new password twice. Input is hidden.
4. Remove the variable and recreate the container again.

The command targets the user `arcane` unless you pass `--username`:

<Snippet text="docker exec -it arcane arcane admin reset-password --username alice" class="mt-2 mb-4 w-full" />

It refuses any account that does not resolve to **effective global administrator** permissions — you cannot use it to take over a regular user. An unknown name reports `global administrator "<name>" not found`.

On success it prints `Password reset successfully for global administrator "<username>"` and revokes every session that user had. The new password must satisfy the configured [password policy](#password-policy).

## Clear passkey MFA

Use this when an account has MFA enabled but has lost its passkey and its recovery codes, or when an OIDC-only account has no password and no passkey on the browser in front of it.

1. Add `ALLOW_CLI_MFA_RESET=true` to Arcane's environment and recreate the container.
2. Run:

<Snippet text="docker exec -it arcane arcane admin reset-mfa --username alice" class="mt-2 mb-4 w-full" />

3. Confirm by typing `RESET` exactly when prompted.
4. Remove the variable and recreate the container again.

Unlike the password reset, this one is not restricted to administrators — `--username` accepts any account, and defaults to `arcane`.

It disables passkey MFA, deletes the account's recovery codes, cancels any pending MFA transaction, and revokes the user's sessions. Registered passkeys are left in place, so the user can sign in with their password or OIDC provider and re-enable MFA afterwards. See <Link href="/docs/security/passkeys">Passkeys & MFA</Link>.

## Sessions end immediately

Both commands revoke the target user's sessions, and that revocation takes effect at once — Arcane revalidates cached access tokens against persisted session state, so an already-signed-in browser or a horizontally-scaled second instance is cut off right away rather than at the end of a cache interval.

## Password policy

Every path that sets a password enforces the tier configured under **Settings → Authentication → Password Policy**: an administrator creating a user, an administrator changing another user's password, a user changing their own password, and `arcane admin reset-password`.

| Policy     | Requirement                                                                                        |
| ---------- | -------------------------------------------------------------------------------------------------- |
| `basic`    | At least 8 characters.                                                                             |
| `standard` | At least 10 characters, including an uppercase letter, a lowercase letter, and a number.           |
| `strong`   | At least 12 characters, including an uppercase letter, a lowercase letter, a number, and a symbol. |

A password that falls short is rejected with the requirement as the error message. If the setting cannot be read or holds an unrecognized value, Arcane falls back to `strong` — the policy fails closed.

## Accounts with legacy bcrypt hashes

> [!WARNING]
> Arcane no longer accepts bcrypt password hashes. Any account still storing a `$2a$`, `$2b$`, or `$2y$` hash fails to sign in with `invalid hash format` and must have its password reset.

Arcane used to transparently re-hash a bcrypt password to Argon2 the next time that user signed in. That upgrade-on-login path is gone, so an account that never signed in during the window when it existed still holds the old hash. Reset it with `arcane admin reset-password` (for an administrator) or from **Settings → Users** with an account that can still sign in.
