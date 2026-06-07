---
title: 'Federated Credentials'
description: 'Let CI/CD pipelines and automation sign in to Arcane with short-lived OIDC tokens instead of long-lived API keys.'
order: 4
---

<script lang="ts">
import { Snippet } from '$lib/components/ui/snippet/index.js';
import { Link } from '$lib/components/ui/link/index.js';
</script>

Federated credentials let an external workload — a GitHub Actions job, a GitLab CI pipeline, or any OIDC provider — sign in to Arcane using the short-lived token its platform already issues. Nothing long-lived is stored in your pipeline: there is no API key or password to create, leak, or rotate.

You register a **trust rule** once. From then on, any workload that matches the rule can exchange its OIDC token for a short-lived Arcane token automatically.

> [!NOTE]
> This is for machines, not people. For interactive sign-in by human users, see <Link href="/docs/configuration/sso">OIDC Single Sign-On</Link>.

## How it works

1. An admin registers a federated credential — a rule that says *"tokens from this issuer, for this audience, with this subject, get this role."*
2. In CI, the workload (or the Arcane CLI) fetches its OIDC token from the platform.
3. The CLI sends that token to Arcane.
4. Arcane verifies the token's signature against the issuer's published keys, checks the audience and subject against your rule, then returns a short-lived Arcane token.
5. The CLI uses that token for the rest of the job.

Because the match is made on the token's cryptographically signed claims, one workload can never impersonate another, and there is no shared secret to manage.

## Create a federated credential

There is no global switch to flip — federated credentials become active as soon as you create an enabled trust rule, and stop working the moment you disable or delete it.

1. Go to **Settings → Federated Credentials** and select **Create**.
2. Fill in the fields below.
3. Save, and toggle **Enabled** on.

| Field          | What it does                                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Name           | A label to identify the rule.                                                                                             |
| Issuer URL     | The OIDC issuer that signs the workload's tokens, e.g. `https://token.actions.githubusercontent.com`. Must be HTTPS.       |
| Audience       | The audience the token must carry. Pick a value you control (your Arcane URL works well) and request the same one in CI.   |
| Subject match  | Which workloads to trust, compared against the token's `sub` claim. Use **exact** for one subject, or **glob** (`*`) for a pattern. |
| Role           | The Arcane role granted to matching workloads.                                                                            |
| Scope          | Apply the role globally or to a single environment.                                                                       |
| Token lifetime | How long each issued Arcane token lasts (60–3600 seconds, default 900).                                                   |
| Enabled        | Whether the rule currently accepts exchanges.                                                                             |

> [!CAUTION]
> A broad subject match — `*`, or a whole organization — trusts **every** workflow in that scope, including forks and pull requests. Always match the most specific subject you can, usually a single repository and branch.

## Subject formats by provider

The **subject match** is the heart of the rule: it decides exactly which workflow is trusted. The format comes from your provider.

### GitHub Actions

- **Issuer:** `https://token.actions.githubusercontent.com`
- **Subject examples:**
  - `repo:OWNER/REPO:ref:refs/heads/main` — the `main` branch
  - `repo:OWNER/REPO:environment:production` — a GitHub Environment
  - `repo:OWNER/REPO:pull_request` — pull requests
- The workflow must request `id-token: write` permission.

### GitLab CI

- **Issuer:** `https://gitlab.com` (or your self-hosted GitLab URL)
- **Subject example:** `project_path:GROUP/PROJECT:ref_type:branch:ref:main`
- Define an `id_tokens` entry with the audience you configured.

## Authenticate from a pipeline

Use `arcane-cli auth federated`. It auto-detects GitHub Actions and GitLab CI, fetches the OIDC token for you, and exchanges it for an Arcane token. The `--export` flag prints the token as a shell variable so the rest of the job can use it — it is never written to disk.

### GitHub Actions

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write # required so the job can mint an OIDC token
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

For any other OIDC source, pass the token yourself:

<Snippet text='arcane-cli auth federated --token "$MY_OIDC_TOKEN" --audience https://arcane.example.com --export' class="mt-2 mb-2 w-full" />

You can also use `--token-file <path>` or `--token-stdin`.

## Reference

### `arcane-cli auth federated` flags

| Flag                                       | Description                                                                          |
| ------------------------------------------ | ------------------------------------------------------------------------------------ |
| `--audience`                               | Audience to request and send. Falls back to the `federated_audience` config value.   |
| `--server`                                 | Arcane server URL to use for this exchange.                                          |
| `--provider`                               | `auto` (default), `github`, `gitlab`, or `generic`.                                  |
| `--token`, `--token-file`, `--token-stdin` | Supply the external token explicitly instead of auto-detecting it.                   |
| `--export`                                 | Print `export ARCANE_TOKEN=…` for reuse by later commands in the same shell.         |
| `--json`                                   | Output the result as JSON.                                                           |
| `--persist`                                | Save the issued token to the CLI config file (off by default).                       |

Under the hood, Arcane exposes a standard <Link href="https://datatracker.ietf.org/doc/html/rfc8693">OAuth 2.0 Token Exchange (RFC 8693)</Link> endpoint at `/api/auth/federated/token`. The CLI calls it for you, but any compliant client can use it too.

## Security notes

- Issued tokens are **short-lived** (15 minutes by default) and carry only the role you mapped — nothing more.
- Arcane verifies every token's signature against the issuer's published keys, so a workload cannot forge another's identity.
- Prefer **exact** subject matches; reserve wildcards for scopes you have deliberately chosen to trust.
- **Disabling or deleting** a credential immediately blocks new exchanges and revokes any tokens it has already issued.

For the roles you can assign and how environment scopes work, see <Link href="/docs/security/rbac">Access Control</Link>.
