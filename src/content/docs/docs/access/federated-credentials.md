---
title: 'Federated Credentials'
description: 'Let CI/CD pipelines and automation sign in to Arcane with short-lived OIDC tokens instead of long-lived API keys.'
---

Federated credentials let CI jobs exchange an OIDC token for a short-lived Arcane token. Create a **trust rule** for the jobs you allow; the pipeline needs no Arcane password or API key.

> [!NOTE]
> This is for machines. For human sign-in, see [OIDC Single Sign-On](/docs/access/sso).

The CLI sends the CI platform's OIDC token to Arcane. Arcane verifies its signature against the issuer's keys and checks audience and subject against your rule. Matching jobs get an Arcane token with the mapped role.

## Create a federated credential

Go to **System → Authentication → Federated Credentials**, select **Create**, fill in the fields, save, and toggle **Enabled** on.

| Field          | What it does                                                                                                                        |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Name           | A label to identify the rule.                                                                                                       |
| Issuer URL     | The OIDC issuer that signs the workload's tokens, e.g. `https://token.actions.githubusercontent.com`. Must be HTTPS.                |
| Audience       | The audience the token must carry. Pick a value you control (your Arcane URL works well) and request the same one in CI.            |
| Subject match  | Which workloads to trust, compared against the token's `sub` claim. Use **exact** for one subject, or **glob** (`*`) for a pattern. |
| Role           | The Arcane role granted to matching workloads.                                                                                      |
| Scope          | Apply the role globally or to a single environment.                                                                                 |
| Token lifetime | How long each issued Arcane token lasts (60–3600 seconds, default 900).                                                             |
| Enabled        | Whether the rule currently accepts exchanges.                                                                                       |

> [!CAUTION]
> A broad subject match — `*`, or a whole organization — trusts **every** workflow in that scope, including forks and pull requests. Always match the most specific subject you can, usually a single repository and branch.

## Subject formats by provider

### GitHub Actions

- **Issuer:** `https://token.actions.githubusercontent.com`
- **Subject examples:** `repo:OWNER/REPO:ref:refs/heads/main` (the `main` branch), `repo:OWNER/REPO:environment:production` (a GitHub Environment), `repo:OWNER/REPO:pull_request` (pull requests)
- The workflow must request `id-token: write` permission.

### GitLab CI

- **Issuer:** `https://gitlab.com` (or your self-hosted GitLab URL)
- **Subject example:** `project_path:GROUP/PROJECT:ref_type:branch:ref:main`
- Define an `id_tokens` entry with the audience you configured.

## Authenticate from a pipeline

`arcane-cli auth federated` detects GitHub Actions or GitLab CI and exchanges the platform token. `--export` prints the Arcane token as a shell variable without saving it to disk.

### GitHub Actions

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    steps:
      - name: Install the Arcane CLI
        run: curl -fsSL https://getarcane.app/install-cli.sh | sh
      - name: Authenticate and deploy
        run: |
          eval "$(arcane-cli auth federated --server https://arcane.example.com --audience https://arcane.example.com --export)"
          arcane-cli projects up my-app
```

> [!TIP]
> Each GitHub Actions `run:` step is a fresh shell, so authenticate and run your commands in the **same** step — or write the token to `$GITHUB_ENV` to share it across steps.

### GitLab CI

```yaml
deploy:
  id_tokens:
    ARCANE_ID_TOKEN:
      aud: https://arcane.example.com
  script:
    - eval "$(arcane-cli auth federated --audience https://arcane.example.com --token "$ARCANE_ID_TOKEN" --export)"
    - arcane-cli projects up my-app
```

### Other providers

For any other OIDC source, pass the token yourself, or use `--token-file <path>` or `--token-stdin`:

```bash
arcane-cli auth federated --token "$MY_OIDC_TOKEN" --audience https://arcane.example.com --export
```

## Reference

### `arcane-cli auth federated` flags

| Flag                                       | Description                                                                        |
| ------------------------------------------ | ---------------------------------------------------------------------------------- |
| `--audience`                               | Audience to request and send. Falls back to the `federated_audience` config value. |
| `--server`                                 | Arcane server URL to use for this exchange.                                        |
| `--provider`                               | `auto` (default), `github`, `gitlab`, or `generic`.                                |
| `--token`, `--token-file`, `--token-stdin` | Supply the external token explicitly instead of auto-detecting it.                 |
| `--export`                                 | Print `export ARCANE_TOKEN=…` for reuse by later commands in the same shell.       |
| `--json`                                   | Output the result as JSON.                                                         |
| `--persist`                                | Save the issued token to the CLI config file (off by default).                     |

Other clients can call `/api/auth/federated/token` using [OAuth 2.0 Token Exchange (RFC 8693)](https://datatracker.ietf.org/doc/html/rfc8693).

## Security notes

- Issued tokens are **short-lived** (15 minutes by default) and carry only the mapped role.
- Arcane verifies every token's signature against the issuer's published keys, so a workload can't forge another's identity.
- Prefer **exact** subject matches; use wildcards only for scopes you deliberately trust.
- **Disabling or deleting** a credential blocks new exchanges and revokes tokens it already issued.

For roles and environment scopes, see [Roles & Permissions](/docs/access/roles).
