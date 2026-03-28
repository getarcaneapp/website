---
title: 'Swarm Workloads'
description: 'Deploy and manage Docker Swarm stacks, services, and tasks in Arcane'
order: 2
---

<script lang="ts">
import { Link } from '$lib/components/ui/link/index.js';
import { Snippet } from '$lib/components/ui/snippet/index.js';
</script>

Arcane gives you two main workload views in Swarm: **Stacks** for application-level deployments and **Services** for direct service-level control. The **Tasks** view helps you inspect what Swarm is actually scheduling and running.

## Stacks

Stacks are the recommended way to deploy applications to Swarm in Arcane. They give you an application-level entry point and group related services together.

Arcane supports:

- deploying a new stack from Compose content
- supplying `.env` content for variable substitution
- editing and redeploying an existing stack
- removing a stack
- viewing the services and tasks that belong to a stack
- starting from a template
- converting a `docker run` command into Compose as a starting point

## How Arcane finds stacks

When you open the **Stacks** page, Arcane is answering a simple question: **what stacks does this Swarm manager see right now?**

To do that, Arcane asks Docker for the current Swarm services and groups them by the `com.docker.stack.namespace` label.

That means the stack list is live. It is not built from a database table, and it is not reconstructed from saved Compose files on disk.

Because of that, a stack can appear in Arcane even if Arcane did not create it. If the selected manager can see the stack's services, Arcane can list the stack.

To deploy a stack:

1. Open **Swarm > Stacks**.
2. Click **Create Stack**.
3. Enter a stack name.
4. Paste your Compose content.
5. Optionally add `.env` content for variables referenced by the Compose file.
6. Click **Create Stack**.

Useful shortcuts in the stack editor:

- **Use Template**: load a saved Arcane template into the stack editor. See <Link href="/docs/templates">Using Templates</Link>.
- **Convert from Docker Run**: paste a `docker run` command and let Arcane generate Compose content and env values as a starting point. For standalone Compose prep, you can also use the <Link href="/generator">Compose Generator</Link>.
- **Save as Template**: save the current stack editor content as a reusable template.

To update a stack, open it from **Swarm > Stacks**, click **Edit**, change the Compose or `.env` content, and redeploy. To remove a stack, use the stack detail page or row action and confirm the delete.

## Where the saved stack source lives

**View Source** is answering a different question: **what Compose files has Arcane saved for this stack?**

Those saved files are separate from the live stack list above.

When Arcane saves a stack source during deploy, it writes those files to disk under the Swarm stack sources directory. By default that root is:

<Snippet text="/app/data/swarm/sources" class="mt-2 mb-2 w-full" />

Inside that directory, Arcane stores files by environment and stack name.

For example, if your environment ID were `env_123` and the stack name were `whoami`, the saved files would look like this:

```text
/app/data/swarm/sources/env_123/whoami/compose.yaml
/app/data/swarm/sources/env_123/whoami/.env
```

The `.env` file is optional.

So there are really two separate data sources:

- the **Stacks** page shows what Docker Swarm is reporting right now
- **View Source** shows the Compose and `.env` files Arcane previously saved on disk

One practical consequence of this: a stack deployed outside Arcane can still appear in the **Stacks** list, but Arcane may not have a saved source for it yet.

## Services

Arcane supports direct service management when you need to work with individual Swarm services instead of full stacks.

You can:

- create a service
- inspect service details
- update the raw service spec
- scale replicated services
- roll back a service to the previous version
- stream service logs
- inspect service tasks
- remove a service

To create a service:

1. Open **Swarm > Services**.
2. Click **Create Service**.
3. Fill in the service definition.
4. Submit the form.

Arcane sends the resulting Swarm service spec directly to the selected environment.

On a service detail page, Arcane can show overview data, live logs, tasks, environment and label configuration, ports and networks, virtual IPs, and storage details when present.

For replicated services, you can scale by opening the service detail page, entering the desired replica count, and clicking **Scale**. Global services are not scaled with replica counts.

Use **Rollback** when you want a server-side rollback to the previous service version after a failed rollout or bad image/configuration update.

## Tasks

The **Tasks** view shows what Swarm is actually scheduling and running.

Use it to:

- confirm where a service is running
- inspect task state and placement
- troubleshoot failed or restarting tasks
- filter work by node, service, or stack

The Tasks page can also open in a node-scoped mode when you navigate from the Nodes page.

## When to Use Stacks vs Services

- Use **Stacks** for normal application deployment and grouped service management.
- Use **Services** when you need direct control over a single Swarm service.
- Use **Tasks** when you need runtime placement and state visibility.

Direct service editing is available, but it is better suited to advanced users who are comfortable with raw Swarm specs.
