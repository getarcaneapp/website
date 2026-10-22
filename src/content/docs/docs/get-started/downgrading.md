---
title: 'Downgrading'
description: 'Roll back to an older Arcane version without losing data.'
---

Arcane migrates its database on upgrade. An older version refuses to start unless you allow a downgrade.

## Downgrade Arcane

1. Back up the Arcane database.
2. Set `ARCANE_ALLOW_DOWNGRADE=true` in the Arcane container's environment.
3. Start the older version. Arcane rolls the database back.
4. Once Arcane starts cleanly, remove `ARCANE_ALLOW_DOWNGRADE` or set it to `false`.

## Recover if the downgrade is refused

An older release only rolls back migrations it knows about. If the log says rollback migrations are unavailable:

1. Restore your pre-upgrade backup.
2. Start the older version.

## Downgrade from 3.0 to 2.x

3.0 can't roll back below its v2.17.1 database baseline.

1. Restore the backup you took before upgrading to 3.0.
2. Start 2.17.1.
