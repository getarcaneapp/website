---
title: 'Activity & Events'
description: 'Track running operations in the Activity Center and audit past actions in the Event Log.'
---

<script lang="ts">
import { Link } from '#lib/components/ui/link/index.js';
import ScreenshotFrame from '#lib/components/screenshot-frame.svelte';
</script>

Arcane records what it is doing in two places. The **Activity Center** shows work that is running right now, with live output. The **Event Log** is the durable audit trail of what happened and who did it.

## Activity Center

Most actions in Arcane — deploying a project, pulling an image, running a scan — don't block the page. They're queued as an _activity_ and run in the background, so you can navigate away and come back.

Open the Activity Center from the icon in the sidebar (or the mobile navigation bar). It lists activities newest first; select one to open the detail panel with its full output.

### Activity types

Arcane tracks activities for image pulls, builds, and update checks; project pull, build, deploy, redeploy, down, restart, and destroy; container start, stop, restart, redeploy, and delete; vulnerability scans; and system prunes.

### Statuses

- **Queued** — waiting for a free slot.
- **Running** — in progress.
- **Completed** — finished successfully.
- **Failed** — finished with an error; the output explains why.
- **Cancelled** — stopped before it finished.

### Live output

Activity output is the raw text the `docker` command line prints, including its ANSI colors — the same thing you'd see running the command in a terminal.

> [!NOTE]
> Earlier releases showed a synthesized progress bar and a percentage. Those have been replaced by the real Docker output, which is more accurate and matches what you'd see on the command line. The <Link href="/docs/features/image-builds">Builds</Link> page changed the same way.

For projects, you can also attach to an operation as it runs instead of watching from here — see **Watch the output live** in <Link href="/docs/features/projects">Projects</Link>.

### Settings

Configure retention under **Settings → Activity**:

- **Retention Days** — how long finished activities are kept.
- **Maximum Entries** — a hard cap on stored activity history.
- **Concurrent Activity Limit** — how many activities may run at once. Activities beyond the limit wait in **Queued**.

If an activity is interrupted — Arcane restarts mid-operation, for example — a background sweep marks it failed rather than leaving it stuck in **Running**.

## Event Log

The Event Log at **Events** is the persistent audit trail. Where an activity is a job that Arcane ran, an event is a record that something happened, and it outlives the activity.

<ScreenshotFrame
  src="/img/screenshots/event-log-page.jpeg"
  alt="Event Log in Arcane"
  caption="The Event Log in Arcane."
  loading="lazy"
  decoding="async"
/>

Each row records:

- **Severity** — how significant the event is.
- **Type** — what kind of event it was.
- **User** — who triggered it, where Arcane can attribute it.
- **Timestamp** — when it happened.

Filter by type and severity, or search, to narrow the list. Select a row to see the full details.

Use the Event Log to answer "who restarted this container?" or "when did that project last redeploy?" — questions the Activity Center can't answer once its history has rolled over.
