---
title: 'Activity & Events'
description: 'Track running operations in the Activity Center and audit past actions in the Event Log.'
---

<script lang="ts">
import { Link } from '#lib/components/ui/link/index.js';
import ScreenshotFrame from '#lib/components/screenshot-frame.svelte';
</script>

<div id="activity-center" class="scroll-m-28">

Open the Activity Center from the sidebar or mobile navigation bar to follow background operations. Select an activity to read its output. You can leave the page while it runs.

</div>

## Activity types

Arcane tracks activities for image pulls, builds, and update checks; project pull, build, deploy, redeploy, down, restart, and destroy; container start, stop, restart, redeploy, and delete; vulnerability scans; and system prunes.

## Statuses

- **Queued** — waiting for a free slot.
- **Running** — in progress.
- **Completed** — finished successfully.
- **Failed** — finished with an error; the output explains why.
- **Cancelled** — stopped before it finished.

## Live output

Activity output shows the text and ANSI colors from the `docker` command, just as you'd see them in a terminal.

> [!NOTE]
> Activity Center and <Link href="/docs/features/image-builds">Builds</Link> now show Docker output instead of generated progress bars.

For projects, you can also attach to an operation as it runs instead of watching from here — see **Watch the output live** in <Link href="/docs/features/projects">Projects</Link>.

## Settings

Configure retention under **Settings → Activity**:

- **Retention Days** — how long finished activities are kept.
- **Maximum Entries** — a hard cap on stored activity history.
- **Concurrent Activity Limit** — how many activities may run at once. Activities beyond the limit wait in **Queued**.

If an activity is interrupted, for example by an Arcane restart, a background check marks it failed so it doesn't stay stuck in **Running**.

## Automation run history

Open an environment's **Automations** tab and open **Run history** for a job to inspect its past runs. The history shows attempts, errors, and results for individual targets. When a run has an activity, open its operation output for more detail.

A queued remote run may show **Waiting for environment** until the agent is reachable. Older agents need an upgrade to support this job history.

For runs that need intervention, the available actions include **Retry run** and **Cancel pending run**. A run marked **Needs attention** can block later runs of the same job. Check its output and the affected resources, then use **Resolve after review** when you've verified the result. Resolving preserves the history and lets later scheduled work proceed; it doesn't rerun the operation or mark it successful.

## Event Log

Open **Events** to view the audit trail. Event records remain available after the corresponding activities have left the Activity Center's history.

<ScreenshotFrame
  src="/img/screenshots/event-log-page.jpeg"
  alt="Event Log in Arcane"
  caption="The Event Log in Arcane."
  loading="lazy"
  decoding="async"
/>

Each row shows **Severity**, **Type**, **User** when known, and **Timestamp**. Search or filter by type and severity, then select a row for details.

The log also records Docker daemon events, including container exits, out-of-memory kills, unhealthy status changes, and image, network, and volume changes. This includes actions taken outside Arcane, such as starting a container from the Docker CLI. New events appear as they arrive.
