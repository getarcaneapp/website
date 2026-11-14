---
title: "Account Recovery"
description: "Reset an administrator password or clear passkey MFA from inside the Arcane container when nobody can sign in."
---

These commands update the database inside the Arcane container without starting the HTTP server. Both end the user's sessions immediately, including cached sessions on other Arcane instances.

> [!NOTE]
> Run these with the container's `arcane` binary. The standalone [`arcane-cli`](/docs/reference/cli/commands) needs API access and can't recover a locked-out account.

## Reset an administrator password

1. Add `ARCANE_ALLOW_CLI_PASSWORD_RESET=true` to Arcane's environment and recreate the container.
2. Run the command:

   ```bash
   docker exec -it arcane arcane admin reset-password
   ```

   It resets the user `arcane`. For another admin, add `--username alice`.

3. Enter the new password twice. Input is hidden.
4. Remove the variable and recreate the container again.

On success it prints `Password reset successfully for global administrator "<username>"` and revokes all that user's sessions. It also clears a pending required password change, such as the one on the default `arcane` account.

- Only accounts with global administrator permissions can be reset. An unknown name returns `global administrator "<name>" not found`.
- The new password must meet the [password policy](#password-policy).

## Clear passkey MFA

Use this when an MFA account has lost its passkey and recovery codes, or an OIDC-only account has no password and no passkey on the current browser. It works on any account, not only administrators.

1. Add `ARCANE_ALLOW_CLI_MFA_RESET=true` to Arcane's environment and recreate the container.
2. Run the command (`--username` defaults to `arcane`):

   ```bash
   docker exec -it arcane arcane admin reset-mfa --username alice
   ```

3. Type `RESET` exactly when prompted.
4. Remove the variable and recreate the container again.

This disables passkey MFA, deletes recovery codes, cancels any pending MFA transaction, and revokes the user's sessions. Registered passkeys stay, so the user can sign in with a password or OIDC and turn MFA back on. See [Passkeys & MFA](/docs/access/passkeys).

## Why the commands are off by default

Both commands grant administrator access, so each needs its own variable. Turn it on only while you use it.

| Command                       | Turned on by                           |
| ----------------------------- | -------------------------------------- |
| `arcane admin reset-password` | `ARCANE_ALLOW_CLI_PASSWORD_RESET=true` |
| `arcane admin reset-mfa`      | `ARCANE_ALLOW_CLI_MFA_RESET=true`      |

Without the variable, the command refuses:

```bash
CLI password reset is disabled; set ARCANE_ALLOW_CLI_PASSWORD_RESET=true to enable it
```

## Required password change

The default `arcane` account must change its password at first sign-in. Until it does, the server answers every signed-in request except reading the current user, loading the session, changing the password, and signing out with `403 password change required`. Changing the password or running `arcane admin reset-password` clears the requirement.

## Password policy

**System → Authentication → Password Policy** applies to every password creation and change, including `arcane admin reset-password`.

| Setting                  | Default | Requirement                                          |
| ------------------------ | ------- | ---------------------------------------------------- |
| Minimum Length           | `12`    | Shortest allowed password, from 8 to 128 characters. |
| Require Uppercase Letter | On      | At least one uppercase letter.                       |
| Require Lowercase Letter | On      | At least one lowercase letter.                       |
| Require Number           | On      | At least one number.                                 |
| Require Symbol           | On      | At least one symbol. A space counts as a symbol.     |

Rejected passwords show the current requirements. An unreadable or invalid setting falls back to its default.

Upgrading from the earlier `basic`, `standard`, and `strong` presets keeps the same requirements:

| Preset     | Minimum Length | Uppercase | Lowercase | Number | Symbol |
| ---------- | -------------- | --------- | --------- | ------ | ------ |
| `basic`    | `8`            | Off       | Off       | Off    | Off    |
| `standard` | `10`           | On        | On        | On     | Off    |
| `strong`   | `12`           | On        | On        | On     | On     |

## Accounts with legacy bcrypt hashes

> [!WARNING]
> Arcane doesn't accept or convert bcrypt password hashes. Accounts storing a `$2a$`, `$2b$`, or `$2y$` hash fail to sign in with `invalid hash format`. Reset the password with `arcane admin reset-password` (administrators) or **System → Users** from an account that can still sign in.
