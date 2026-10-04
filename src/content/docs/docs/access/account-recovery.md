---
title: 'Account Recovery'
description: 'Reset an administrator password or clear passkey MFA from inside the Arcane container when nobody can sign in.'
---

These commands recover locked-out accounts by updating the database inside the Arcane container. They don't start the HTTP server. Both end the user's sessions immediately, including cached sessions on other Arcane instances.

> [!NOTE]
> Run these with the container's `arcane` binary. The standalone [`arcane-cli`](/docs/reference/cli/commands) requires API access and can't recover a locked-out account.

Both commands are disabled by default because they allow access to an administrator account. Enable recovery before running them, then disable it again when you're done.

| Command                       | Enabled by                      |
| ----------------------------- | ------------------------------- |
| `arcane admin reset-password` | `ALLOW_CLI_PASSWORD_RESET=true` |
| `arcane admin reset-mfa`      | `ALLOW_CLI_MFA_RESET=true`      |

Run without the gate set and the command refuses:

```bash
CLI password reset is disabled; set ALLOW_CLI_PASSWORD_RESET=true to enable it
```

## Reset an administrator password

1. Add `ALLOW_CLI_PASSWORD_RESET=true` to Arcane's environment and recreate the container.
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

Only accounts with effective global administrator permissions can be reset. An unknown name returns `global administrator "<name>" not found`.

On success it prints `Password reset successfully for global administrator "<username>"` and revokes every session that user had. The new password must satisfy the configured [password policy](#password-policy).

## Clear passkey MFA

Use this when an account has MFA enabled but has lost its passkey and its recovery codes, or when an OIDC-only account has no password and no passkey on the browser in front of it.

1. Add `ALLOW_CLI_MFA_RESET=true` to Arcane's environment and recreate the container.
2. Run:

```bash
docker exec -it arcane arcane admin reset-mfa --username alice
```

3. Confirm by typing `RESET` exactly when prompted.
4. Remove the variable and recreate the container again.

Unlike the password reset, this one is not restricted to administrators — `--username` accepts any account, and defaults to `arcane`.

It disables passkey MFA, deletes the account's recovery codes, cancels any pending MFA transaction, and revokes the user's sessions. Registered passkeys are left in place, so the user can sign in with their password or OIDC provider and re-enable MFA afterwards. See [Passkeys & MFA](/docs/access/passkeys).

## Password policy

**Settings → Authentication → Password Policy** applies to all password creation and changes, including `arcane admin reset-password`.

| Policy     | Requirement                                                                                        |
| ---------- | -------------------------------------------------------------------------------------------------- |
| `basic`    | At least 8 characters.                                                                             |
| `standard` | At least 10 characters, including an uppercase letter, a lowercase letter, and a number.           |
| `strong`   | At least 12 characters, including an uppercase letter, a lowercase letter, a number, and a symbol. |

Rejected passwords show the unmet requirement. If the policy is unreadable or invalid, Arcane uses `strong`.

## Accounts with legacy bcrypt hashes

> [!WARNING]
> Arcane doesn't accept bcrypt password hashes, and doesn't convert them on login. Any account still storing a `$2a$`, `$2b$`, or `$2y$` hash fails to sign in with `invalid hash format` and must have its password reset.

Reset an administrator's password with `arcane admin reset-password`, or use **Settings → Users** from an account that can still sign in.
