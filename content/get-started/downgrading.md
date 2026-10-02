---
title: 'Downgrading'
description: 'Go back to an older Arcane version without losing your data.'
---

Arcane updates its database when you upgrade. If you start an older version against that database, Arcane stops at startup instead of guessing, so you have to allow the downgrade explicitly.

## Downgrade Arcane

1. Back up the Arcane database.
2. Add `ALLOW_DOWNGRADE=true` to the Arcane container's environment.
3. Start the older version. Arcane rolls the database back to the version that release expects.
4. Once it starts cleanly, remove `ALLOW_DOWNGRADE` or set it to `false`.

## If the downgrade is refused

An older release can only undo database changes it knows about. When the database has changes made by a newer release that the older one doesn't include, Arcane refuses to start even with `ALLOW_DOWNGRADE=true`, and the log says the rollback SQL is unavailable.

In that case, restore the database from a backup taken before you upgraded, then start the older version.
