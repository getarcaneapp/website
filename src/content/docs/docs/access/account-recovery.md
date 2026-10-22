---
title: 'Account Recovery'
description: 'Reset an administrator password or clear passkey MFA from inside the Arcane container when nobody can sign in.'
---

Use these commands to recover a locked-out account. They update the database inside the Arcane container without starting the HTTP server. Both end the user's sessions immediately, including cached sessions on other Arcane instances.

> [!NOTE]
> Run these with the container's `arcane` binary. The standalone [`arcane-cli`](/docs/reference/cli/commands) requires API access and can't recover a locked-out account.

Both commands are disabled by default because they grant administrator access. Enable each only while you use it:

| Command                       | Enabled by                      |
| ----------------------------- | ------------------------------- |
| `arcane admin reset-password` | `ARCANE_ALLOW_CLI_PASSWORD_RESET=true` |
| `arcane admin reset-mfa`      | `ARCANE_ALLOW_CLI_MFA_RESET=true`      |

Without the gate set, the command refuses:

```bash
CLI password reset is disabled; set ARCANE_ALLOW_CLI_PASSWORD_RESET=true to enable it
```

## Reset an administrator password

1. Add `ARCANE_ALLOW_CLI_PASSWORD_RESET=true` to Arcane's environment and recreate the container.
2. Run the command interactively:

```bash
docker exec -it arcane arcane admin reset-password
```

3. Enter the new password twice. Input is hidden.
4. Remove the variable and recreate the container again.

The command targets the user `arcane` unless you pass `--username`:

```bash
docker exec -it arcane arcane admin reset-password --username alice
```

Only accounts with effective global administrator permissions can be reset. An unknown name returns `global administrator "<name>" not found`. On success it prints `Password reset successfully for global administrator "<username>"` and revokes all that user's sessions. The new password must meet the [password policy](#password-policy).

## Clear passkey MFA

Use this when an MFA account has lost its passkey and recovery codes, or an OIDC-only account has no password and no passkey on the current browser.

1. Add `ARCANE_ALLOW_CLI_MFA_RESET=true` to Arcane's environment and recreate the container.
2. Run:

```bash
docker exec -it arcane arcane admin reset-mfa --username alice
```

3. Type `RESET` exactly when prompted.
4. Remove the variable and recreate the container again.

This works on any account, not only administrators; `--username` defaults to `arcane`. It disables passkey MFA, deletes recovery codes, cancels any pending MFA transaction, and revokes the user's sessions. Registered passkeys stay, so the user can sign in with a password or OIDC and re-enable MFA. See [Passkeys & MFA](/docs/access/passkeys).

## Password policy

**System → Authentication → Password Policy** applies to every password creation and change, including `arcane admin reset-password`.

| Policy     | Requirement                                                                                        |
| ---------- | -------------------------------------------------------------------------------------------------- |
| `basic`    | At least 8 characters.                                                                             |
| `standard` | At least 10 characters, including an uppercase letter, a lowercase letter, and a number.           |
| `strong`   | At least 12 characters, including an uppercase letter, a lowercase letter, a number, and a symbol. |

Rejected passwords show the unmet requirement. An unreadable or invalid policy falls back to `strong`.

## Accounts with legacy bcrypt hashes

> [!WARNING]
> Arcane doesn't accept or convert bcrypt password hashes. Accounts storing a `$2a$`, `$2b$`, or `$2y$` hash fail to sign in with `invalid hash format`. Reset the password with `arcane admin reset-password` (administrators) or **System → Users** from an account that can still sign in.
